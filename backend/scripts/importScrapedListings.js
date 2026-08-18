// Imports the raw scraped listings in backend/data/raw/*.json, matches the
// same physical laptop across Spacenet / MyTek / Tunisianet by manufacturer
// SKU, and upserts Product/Price documents so prices can be compared.
//
// Usage:
//   node scripts/importScrapedListings.js            (dry run, prints report only)
//   node scripts/importScrapedListings.js --commit    (writes to MongoDB)

const fs = require("fs");
const path = require("path");
const {
  fixEncoding,
  parsePriceTND,
  detectBrand,
  findSkuCandidate,
  stripVariantTokens,
  canonicalSkuKey,
  extractRamGB,
  extractStorageGB,
  extractCpu,
  extractGpu,
} = require("./lib/textUtils");

const RAW_DIR = path.join(__dirname, "..", "data", "raw");

const STORES = [
  { key: "spacenet", name: "Spacenet", file: "spacenet.json", website: "https://spacenet.tn", city: "Sousse", logo: "SP" },
  { key: "mytek", name: "MyTek", file: "mytek.json", website: "https://www.mytek.tn", city: "Tunis", logo: "MT" },
  { key: "tunisianet", name: "Tunisianet", file: "tunisianet.json", website: "https://www.tunisianet.com.tn", city: "Ariana", logo: "TN" },
];

function loadRawRows(file) {
  const filePath = path.join(RAW_DIR, file);
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function normalizeRow(row, storeKey) {
  const title = fixEncoding(row["Link"] || "");
  const url = row["Link URL"] || "";
  const image = fixEncoding(row["Image"] || "");
  const description = fixEncoding(row["Description"] || "");
  const price = parsePriceTND(row["Price"]);

  if (!title || !url || price === null) return null;

  const skuRaw = findSkuCandidate(row);
  if (!skuRaw) return null;

  const combinedRaw = [title, description, ...Object.values(row).filter((v) => typeof v === "string")].join(" ");
  const text = fixEncoding(combinedRaw);

  const brand = detectBrand(text);
  const baseSku = stripVariantTokens(skuRaw);
  const matchSku = canonicalSkuKey(brand, baseSku);
  const ramGB = extractRamGB(text);
  const storageGB = extractStorageGB(text);
  const cpu = extractCpu(text);
  const gpu = extractGpu(text);

  const matchKey = `${brand}::${matchSku}::${ramGB ?? "UNK"}`;

  return {
    store: storeKey,
    title,
    url,
    image,
    price,
    skuRaw,
    baseSku,
    matchKey,
    specs: { brand, cpu, ramGB, storageGB, gpu },
  };
}

function loadAllListings() {
  const listings = [];
  const skipped = {};
  for (const store of STORES) {
    skipped[store.key] = 0;
    const rows = loadRawRows(store.file);
    for (const row of rows) {
      const item = normalizeRow(row, store.key);
      if (item) listings.push(item);
      else skipped[store.key] += 1;
    }
  }
  return { listings, skipped };
}

function groupListings(listings) {
  const groups = new Map();
  for (const item of listings) {
    if (!groups.has(item.matchKey)) groups.set(item.matchKey, []);
    groups.get(item.matchKey).push(item);
  }
  return groups;
}

// A store can list several bundle variants of the same config (freebie,
// backpack, OS edition). Keep only the cheapest one as that store's price.
function pickCheapestPerStore(items) {
  const byStore = new Map();
  for (const item of items) {
    const existing = byStore.get(item.store);
    if (!existing || item.price < existing.price) byStore.set(item.store, item);
  }
  return [...byStore.values()];
}

function buildProductFromGroup(items) {
  const nonTruncated = items.filter((i) => !i.title.includes("..."));
  const pool = nonTruncated.length ? nonTruncated : items;
  const name = pool.reduce((longest, i) => (i.title.length > longest.length ? i.title : longest), pool[0].title);

  const specs = {};
  for (const item of items) {
    for (const [k, v] of Object.entries(item.specs)) {
      if (v !== null && v !== undefined && specs[k] === undefined) specs[k] = v;
    }
  }

  const withImage = items.find((i) => i.image);

  return {
    name,
    brand: specs.brand || "Autre",
    category: "PC Gamer",
    description: "",
    image: withImage ? withImage.image : "",
    specifications: {
      cpu: specs.cpu || null,
      ramGB: specs.ramGB || null,
      storageGB: specs.storageGB || null,
      gpu: specs.gpu || null,
    },
  };
}

function printReport(groups) {
  const summary = { 1: 0, 2: 0, 3: 0 };
  const rows = [];
  for (const [key, items] of groups) {
    const perStore = pickCheapestPerStore(items);
    const storeCount = new Set(perStore.map((i) => i.store)).size;
    summary[storeCount] = (summary[storeCount] || 0) + 1;
    rows.push({ key, storeCount, perStore });
  }

  console.log("\n=== Match summary ===");
  console.log(`Matched in all 3 stores: ${summary[3] || 0}`);
  console.log(`Matched in 2 stores:     ${summary[2] || 0}`);
  console.log(`Only 1 store:            ${summary[1] || 0}`);
  console.log(`Total product groups:    ${groups.size}`);

  console.log("\n=== Cross-store matches (2 or 3 stores) ===");
  rows
    .filter((r) => r.storeCount >= 2)
    .sort((a, b) => b.storeCount - a.storeCount)
    .forEach((r) => {
      const priceLine = r.perStore
        .sort((a, b) => a.price - b.price)
        .map((i) => `${i.store}=${i.price}DT`)
        .join("  ");
      console.log(`[${r.storeCount}/3] ${r.key.padEnd(28)} ${priceLine}`);
    });
}

async function commitToDb(groups) {
  const mongoose = require("mongoose");
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
  const connectDB = require("../config/db");
  const Store = require("../models/Store");
  const Product = require("../models/Product");
  const Price = require("../models/Price");

  await connectDB();

  const storeDocs = new Map();
  for (const s of STORES) {
    let doc = await Store.findOne({ name: s.name });
    if (!doc) doc = await Store.create({ name: s.name, website: s.website, city: s.city, logo: s.logo });
    storeDocs.set(s.key, doc);
  }

  let createdProducts = 0;
  let updatedProducts = 0;
  let upsertedPrices = 0;

  for (const [matchKey, items] of groups) {
    const perStore = pickCheapestPerStore(items);
    const productData = buildProductFromGroup(items);

    let product = await Product.findOne({ "specifications.matchKey": matchKey });
    if (product) {
      product.name = productData.name;
      product.brand = productData.brand;
      product.image = productData.image || product.image;
      product.specifications = { ...productData.specifications, matchKey };
      await product.save();
      updatedProducts += 1;
    } else {
      product = await Product.create({
        ...productData,
        specifications: { ...productData.specifications, matchKey },
      });
      createdProducts += 1;
    }

    for (const item of perStore) {
      const storeDoc = storeDocs.get(item.store);
      let priceDoc = await Price.findOne({ productId: product._id, storeId: storeDoc._id });
      if (priceDoc) {
        priceDoc.price = item.price;
        priceDoc.url = item.url;
        priceDoc.date = new Date();
        await priceDoc.save();
      } else {
        await Price.create({ productId: product._id, storeId: storeDoc._id, price: item.price, url: item.url });
      }
      upsertedPrices += 1;
    }
  }

  console.log(`\nProducts created: ${createdProducts}, updated: ${updatedProducts}`);
  console.log(`Prices upserted: ${upsertedPrices}`);

  await mongoose.disconnect();
}

async function main() {
  const commit = process.argv.includes("--commit");

  const { listings, skipped } = loadAllListings();
  console.log(`Parsed listings: ${listings.length}`);
  console.log(
    `Skipped (missing price/title/SKU): ${STORES.map((s) => `${s.key}=${skipped[s.key]}`).join(", ")}`,
  );

  const groups = groupListings(listings);
  printReport(groups);

  if (!commit) {
    console.log("\nDry run only — nothing written. Re-run with --commit to write to MongoDB.");
    return;
  }

  await commitToDb(groups);
}

main().catch((error) => {
  console.error("Import failed:", error);
  process.exit(1);
});
