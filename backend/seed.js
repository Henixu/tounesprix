const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");
const Store = require("./models/Store");
const Price = require("./models/Price");

const stores = [
  { name: "MyTek", logo: "MT", city: "Tunis", website: "https://www.mytek.tn" },
  { name: "Tunisianet", logo: "TN", city: "Ariana", website: "https://www.tunisianet.com.tn" },
  { name: "Mega PC", logo: "MPC", city: "Sfax", website: "https://www.megapc.tn" },
  { name: "Wiki", logo: "WK", city: "Tunis", website: "https://www.wiki.tn" },
  { name: "Spacenet", logo: "SP", city: "Sousse", website: "https://www.spacenet.tn" },
];

const products = [
  {
    name: "ASUS TUF Gaming F15",
    brand: "ASUS",
    category: "PC portables",
    description: "PC portable gaming equilibre pour jeux AAA et creation de contenu.",
    specifications: {
      processor: "Intel Core i7-13620H",
      ram: "16 GB",
      ssd: "1 TB",
      gpu: "NVIDIA RTX 4060",
      screen: "15.6\" FHD 144Hz",
    },
    offers: [
      { store: "MyTek", price: 4299 },
      { store: "Tunisianet", price: 4399 },
      { store: "Spacenet", price: 4349 },
    ],
  },
  {
    name: "Lenovo Legion 5 Pro",
    brand: "Lenovo",
    category: "PC Gamer",
    description: "Chassis solide et refroidissement efficace pour jeu intensif.",
    specifications: {
      processor: "AMD Ryzen 7 8845HS",
      ram: "16 GB",
      ssd: "1 TB",
      gpu: "NVIDIA RTX 4070",
      screen: "16\" WQXGA 165Hz",
    },
    offers: [
      { store: "Wiki", price: 5199 },
      { store: "Mega PC", price: 5299 },
      { store: "MyTek", price: 5249 },
    ],
  },
  {
    name: "HP Victus 16",
    brand: "HP",
    category: "PC portables",
    description: "Bon compromis entre performance, autonomie et prix.",
    specifications: {
      processor: "Intel Core i5-13500H",
      ram: "16 GB",
      ssd: "512 GB",
      gpu: "NVIDIA RTX 4050",
      screen: "16.1\" FHD 144Hz",
    },
    offers: [
      { store: "Spacenet", price: 3799 },
      { store: "MyTek", price: 3899 },
    ],
  },
  {
    name: "Samsung Galaxy S25 256GB",
    brand: "Samsung",
    category: "Smartphones",
    description: "Smartphone premium avec ecran AMOLED et photo polyvalente.",
    specifications: {
      processor: "Snapdragon 8 Gen 4",
      ram: "12 GB",
      ssd: "256 GB",
      screen: "6.4\" AMOLED 120Hz",
    },
    offers: [
      { store: "Tunisianet", price: 3249 },
      { store: "MyTek", price: 3299 },
      { store: "Wiki", price: 3349 },
    ],
  },
  {
    name: "Apple iPad Air M3 11",
    brand: "Apple",
    category: "Tablettes",
    description: "Tablette polyvalente pour productivite et multimedia.",
    specifications: {
      processor: "Apple M3",
      ram: "8 GB",
      ssd: "128 GB",
      screen: "11\" Liquid Retina 120Hz",
    },
    offers: [
      { store: "Tunisianet", price: 2799 },
      { store: "MyTek", price: 2849 },
    ],
  },
  {
    name: "LG UltraGear 27 QHD 165Hz",
    brand: "LG",
    category: "Moniteurs",
    description: "Moniteur gaming fluide avec bonne colorimetrie.",
    specifications: { screen: "27\" QHD 165Hz" },
    offers: [
      { store: "MyTek", price: 1179 },
      { store: "Tunisianet", price: 1219 },
    ],
  },
  {
    name: "MSI RTX 5070 Ventus 12GB",
    brand: "MSI",
    category: "Cartes graphiques",
    description: "Carte graphique nouvelle generation pour 1440p ultra.",
    specifications: { gpu: "NVIDIA RTX 5070", ram: "12 GB" },
    offers: [
      { store: "Mega PC", price: 2899 },
      { store: "MyTek", price: 2949 },
    ],
  },
  {
    name: "Kingston NV3 SSD 1TB",
    brand: "Kingston",
    category: "SSD",
    description: "SSD NVMe fiable pour upgrades bureau et laptop.",
    specifications: { ssd: "1 TB" },
    offers: [
      { store: "MyTek", price: 249 },
      { store: "Mega PC", price: 259 },
      { store: "Tunisianet", price: 269 },
    ],
  },
  {
    name: "Corsair Vengeance DDR5 32GB",
    brand: "Corsair",
    category: "RAM",
    description: "Kit DDR5 stable pour multitache et creation.",
    specifications: { ram: "32 GB" },
    offers: [
      { store: "MyTek", price: 389 },
      { store: "Spacenet", price: 399 },
    ],
  },
  {
    name: "Logitech G413 SE",
    brand: "Logitech",
    category: "Claviers",
    description: "Clavier mecanique compact et durable pour gaming et bureautique.",
    specifications: { format: "TKL", switch: "Mecanique tactile" },
    offers: [
      { store: "MyTek", price: 149 },
      { store: "Wiki", price: 159 },
    ],
  },
  {
    name: "Logitech G502 Hero",
    brand: "Logitech",
    category: "Souris",
    description: "Souris gaming filaire haute precision avec poids ajustable.",
    specifications: { capteur: "HERO 25K", boutons: "11 programmables" },
    offers: [
      { store: "MyTek", price: 129 },
      { store: "Tunisianet", price: 135 },
      { store: "Spacenet", price: 139 },
    ],
  },
];

const testUsers = [
  { name: "Admin TounesPrix", email: "admin@tounesprix.tn", password: "Admin123!", role: "admin" },
  { name: "Utilisateur Test", email: "user@tounesprix.tn", password: "User123!", role: "user" },
];

async function seed() {
  await connectDB();

  await Promise.all([
    Price.deleteMany({}),
    Product.deleteMany({}),
    Store.deleteMany({}),
    User.deleteMany({}),
  ]);

  const createdStores = await Store.insertMany(stores);
  const storesByName = new Map(createdStores.map((store) => [store.name, store]));

  const createdProducts = await Product.insertMany(
    products.map(({ offers: _offers, ...product }) => product),
  );

  const priceDocs = createdProducts.flatMap((product, index) =>
    products[index].offers.map((offer) => ({
      productId: product._id,
      storeId: storesByName.get(offer.store)._id,
      price: offer.price,
    })),
  );

  await Price.insertMany(priceDocs);
  await User.create(testUsers);

  console.log(`Seed termine: ${createdStores.length} magasins, ${createdProducts.length} produits, ${priceDocs.length} prix, ${testUsers.length} utilisateurs.`);
  console.log("Comptes de test:");
  testUsers.forEach((user) => console.log(`  - ${user.role}: ${user.email} / ${user.password}`));

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error("Echec du seed:", error.message);
  process.exit(1);
});
