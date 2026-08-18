// The scraped JSON was saved with UTF-8 bytes re-decoded as Latin-1 (classic
// mojibake: "GÃ©n" instead of "Gén"). Buffer round-trip reverses it because
// every corrupted codepoint here fits in a single byte (<= 0xFF).
function fixEncoding(value) {
  if (typeof value !== "string" || value === "") return value;
  try {
    return Buffer.from(value, "latin1").toString("utf8");
  } catch (error) {
    return value;
  }
}

// Prices arrive as "2[mojibake]229,000[mojibake]DT" (Spacenet/Tunisianet,
// French thousands separator + comma decimals — the mojibake separator
// sometimes loses a byte in transit, so we don't rely on decoding it) or
// "2429.000 DT" (Mytek, plain decimal). Strip everything except digits,
// commas and periods, then treat the LAST separator group as the decimal
// (millimes) part and concatenate everything before it as the integer part.
function parsePriceTND(rawValue) {
  if (!rawValue) return null;
  let cleaned = String(rawValue).replace(/[^0-9.,]/g, "");
  if (!cleaned) return null;
  const parts = cleaned.split(/[.,]/);
  if (parts.length > 1) {
    const decimals = parts.pop();
    cleaned = parts.join("") + "." + decimals;
  }
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? Math.round(num) : null;
}

const BRANDS = ["ASUS", "MSI", "LENOVO", "HP", "DELL", "ACER"];

function detectBrand(text) {
  const upper = text.toUpperCase();
  for (const brand of BRANDS) {
    if (upper.includes(brand)) {
      return brand === "HP" ? "HP" : brand.charAt(0) + brand.slice(1).toLowerCase();
    }
  }
  return "Autre";
}

// Scans every raw field of a scraped row for a manufacturer SKU/reference.
// SKUs in this data are single tokens made of uppercase letters, digits and
// hyphens, mixing at least one letter and one digit (e.g. "K3605VC-RP488W",
// "9S7-16R831-2607", "C65BFEA"). Natural-language fields ("Ajouter au
// panier", "En stock", "512 Go") always contain a space and get excluded.
function findSkuCandidate(row) {
  const candidates = [];
  for (const rawVal of Object.values(row)) {
    if (typeof rawVal !== "string") continue;
    const stripped = fixEncoding(rawVal).replace(/^\[|\]$/g, "").trim().toUpperCase();
    if (stripped.length < 4 || stripped.length > 30) continue;
    if (!/^[A-Z0-9.\-]+$/.test(stripped)) continue;
    if (!/[A-Z]/.test(stripped) || !/\d/.test(stripped)) continue;
    candidates.push(stripped.replace(/\.+/g, ""));
  }
  if (!candidates.length) return null;
  // Prefer the shortest candidate: longer ones are usually a coincidental
  // match inside a descriptive field rather than the actual SKU.
  candidates.sort((a, b) => a.length - b.length);
  return candidates[0];
}

const NON_HARDWARE_SUFFIXES = /^(SS|SAC|W11P?|SSW11P?|GR|BU)$/i;

// Strips store-specific bundle/OS/RAM-override suffixes (e.g. "-SS", "-W11P",
// "-16", "-24G") from a raw SKU, leaving the manufacturer's base chassis
// code. RAM is derived independently from title/description text, not from
// here, since suffix notation for it differs per store.
function stripVariantTokens(rawSku) {
  let sku = rawSku.replace(/^(BU-|GR-)/i, "");
  let changed = true;
  while (changed) {
    changed = false;
    const match = sku.match(/-([A-Z0-9]+)$/i);
    if (!match) break;
    const token = match[1];
    const isRamToken = /^\d{1,2}G?O?$/i.test(token) && Number(token.replace(/GO?$/i, "")) >= 4;
    if (NON_HARDWARE_SUFFIXES.test(token) || isRamToken) {
      sku = sku.slice(0, -(token.length + 1));
      changed = true;
    }
  }
  return sku;
}

// MSI is the one brand whose SKU format differs by store: Spacenet/Mytek use
// MSI's own part number ("9S7-16R831-2607"), Tunisianet uses its own
// marketing code ("B13UCX-2607XFR") - both embed the same 4-digit variant
// number, which we use as the canonical match key for MSI only.
function canonicalSkuKey(brand, baseSku) {
  if (brand === "Msi") {
    const match = baseSku.match(/(\d{4})/);
    if (match) return match[1];
  }
  return baseSku;
}

function extractRamGB(text) {
  const labelMatch = text.match(/M[ée]moire\s*RAM\s*:?\s*(\d{1,2})\s*Go/i);
  if (labelMatch) return Number(labelMatch[1]);

  const genericMatches = [...text.matchAll(/\b(\d{1,2})\s*(Go|GB)\b/gi)];
  if (genericMatches.length) return Number(genericMatches[0][1]);

  return null;
}

function extractStorageGB(text) {
  const match = text.match(/(\d{3,4})\s*Go?\s*(SSD|NVMe)/i) || text.match(/(\d{3,4})\s*SSD/i);
  return match ? Number(match[1]) : null;
}

function extractCpu(text) {
  let match = text.match(/i([3579])[\s-]?(\d{4,5}[A-Z]{0,3})/i);
  if (match) return `Intel Core i${match[1]}-${match[2].toUpperCase()}`;

  match = text.match(/Core\s*([3579])\s*(\d{2,3}[A-Z]?)\b/i);
  if (match) return `Intel Core ${match[1]} ${match[2].toUpperCase()}`;

  match = text.match(/Ryzen[™®]?\s*([3579])\s*(\d{3,4}[A-Z]{0,3})/i);
  if (match) return `AMD Ryzen ${match[1]} ${match[2].toUpperCase()}`;

  match = text.match(/Ryzen[™®]?\s*([3579])\s+(\d{3})\b/i);
  if (match) return `AMD Ryzen ${match[1]} ${match[2]}`;

  return null;
}

function extractGpu(text) {
  const match = text.match(/RTX\s*-?\s*(\d{4})/i);
  return match ? `RTX ${match[1]}` : null;
}

module.exports = {
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
};
