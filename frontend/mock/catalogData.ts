export type ProductOffer = {
  store: string;
  logo: string;
  price: number;
  url: string;
};

export type ProductSpecs = {
  processor: string;
  ram: string;
  ssd: string;
  gpu: string;
  screen: string;
};

export type MockProduct = {
  id: number;
  name: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  offers: ProductOffer[];
  specs: ProductSpecs;
};

export const mockProducts: MockProduct[] = [
  {
    id: 101,
    name: "ASUS TUF Gaming F15",
    brand: "ASUS",
    category: "PC portables",
    description: "PC portable gaming equilibre pour jeux AAA et creation de contenu.",
    image: "/placeholder-laptop.jpg",
    offers: [
      { store: "Mytek", logo: "MT", price: 4299, url: "https://example.com/mytek-asus-f15" },
      { store: "Tunisianet", logo: "TN", price: 4399, url: "https://example.com/tunisianet-asus-f15" },
      { store: "SBS Informatique", logo: "SBS", price: 4349, url: "https://example.com/sbs-asus-f15" },
    ],
    specs: {
      processor: "Intel Core i7-13620H",
      ram: "16 GB",
      ssd: "1 TB",
      gpu: "NVIDIA RTX 4060",
      screen: "15.6\" FHD 144Hz",
    },
  },
  {
    id: 102,
    name: "Lenovo Legion 5",
    brand: "Lenovo",
    category: "PC portables",
    description: "Chassis solide et refroidissement efficace pour jeu intensif.",
    image: "/placeholder-laptop.jpg",
    offers: [
      { store: "SBS Informatique", logo: "SBS", price: 5199, url: "https://example.com/sbs-legion5" },
      { store: "Mega-PC", logo: "MPC", price: 5299, url: "https://example.com/megapc-legion5" },
      { store: "Mytek", logo: "MT", price: 5249, url: "https://example.com/mytek-legion5" },
    ],
    specs: {
      processor: "AMD Ryzen 7 8845HS",
      ram: "16 GB",
      ssd: "1 TB",
      gpu: "NVIDIA RTX 4070",
      screen: "16\" WQXGA 165Hz",
    },
  },
  {
    id: 103,
    name: "HP Victus 16",
    brand: "HP",
    category: "PC portables",
    description: "Bon compromis entre performance, autonomie et prix.",
    image: "/placeholder-laptop.jpg",
    offers: [
      { store: "Spacenet", logo: "SP", price: 3799, url: "https://example.com/spacenet-victus16" },
      { store: "Mytek", logo: "MT", price: 3899, url: "https://example.com/mytek-victus16" },
    ],
    specs: {
      processor: "Intel Core i5-13500H",
      ram: "16 GB",
      ssd: "512 GB",
      gpu: "NVIDIA RTX 4050",
      screen: "16.1\" FHD 144Hz",
    },
  },
  {
    id: 104,
    name: "Samsung Galaxy S25 256GB",
    brand: "Samsung",
    category: "Smartphones",
    description: "Smartphone premium avec excellent ecran AMOLED et photo polyvalente.",
    image: "/placeholder-phone.jpg",
    offers: [
      { store: "Tunisianet", logo: "TN", price: 3249, url: "https://example.com/tunisianet-s25" },
      { store: "Mytek", logo: "MT", price: 3299, url: "https://example.com/mytek-s25" },
      { store: "Wiki", logo: "WK", price: 3349, url: "https://example.com/wiki-s25" },
    ],
    specs: {
      processor: "Snapdragon 8 Gen 4",
      ram: "12 GB",
      ssd: "256 GB",
      gpu: "Adreno 750",
      screen: "6.4\" AMOLED 120Hz",
    },
  },
  {
    id: 105,
    name: "iPhone 16 128GB",
    brand: "Apple",
    category: "Smartphones",
    description: "iPhone recent avec puce A18 et integration iOS optimisee.",
    image: "/placeholder-phone.jpg",
    offers: [
      { store: "SBS Informatique", logo: "SBS", price: 4299, url: "https://example.com/sbs-iphone16" },
      { store: "Wiki", logo: "WK", price: 4389, url: "https://example.com/wiki-iphone16" },
    ],
    specs: {
      processor: "Apple A18",
      ram: "8 GB",
      ssd: "128 GB",
      gpu: "Apple GPU 5-core",
      screen: "6.1\" OLED 120Hz",
    },
  },
  {
    id: 106,
    name: "Xiaomi 15",
    brand: "Xiaomi",
    category: "Smartphones",
    description: "Performance haut de gamme a tarif agressif.",
    image: "/placeholder-phone.jpg",
    offers: [
      { store: "Spacenet", logo: "SP", price: 2799, url: "https://example.com/spacenet-xiaomi15" },
      { store: "Tunisianet", logo: "TN", price: 2879, url: "https://example.com/tunisianet-xiaomi15" },
    ],
    specs: {
      processor: "Snapdragon 8 Gen 4",
      ram: "12 GB",
      ssd: "256 GB",
      gpu: "Adreno 750",
      screen: "6.36\" AMOLED 120Hz",
    },
  },
  {
    id: 107,
    name: "MSI RTX 5070 Ventus 12GB",
    brand: "MSI",
    category: "Cartes graphiques",
    description: "Carte graphique nouvelle generation pour 1440p ultra.",
    image: "/placeholder-gpu.jpg",
    offers: [
      { store: "Mega-PC", logo: "MPC", price: 2899, url: "https://example.com/megapc-rtx5070" },
      { store: "Mytek", logo: "MT", price: 2949, url: "https://example.com/mytek-rtx5070" },
    ],
    specs: {
      processor: "-",
      ram: "12 GB",
      ssd: "-",
      gpu: "NVIDIA RTX 5070",
      screen: "-",
    },
  },
  {
    id: 108,
    name: "ASUS Dual RTX 5060 Ti 16GB",
    brand: "ASUS",
    category: "Cartes graphiques",
    description: "Excellente option pour montage gaming compact.",
    image: "/placeholder-gpu.jpg",
    offers: [
      { store: "Mytek", logo: "MT", price: 2399, url: "https://example.com/mytek-rtx5060ti" },
      { store: "Wiki", logo: "WK", price: 2479, url: "https://example.com/wiki-rtx5060ti" },
      { store: "SBS Informatique", logo: "SBS", price: 2449, url: "https://example.com/sbs-rtx5060ti" },
    ],
    specs: {
      processor: "-",
      ram: "16 GB",
      ssd: "-",
      gpu: "NVIDIA RTX 5060 Ti",
      screen: "-",
    },
  },
  {
    id: 109,
    name: "Kingston NV3 SSD 1TB",
    brand: "Kingston",
    category: "SSD",
    description: "SSD NVMe fiable pour upgrades bureau et laptop.",
    image: "/placeholder-ssd.jpg",
    offers: [
      { store: "Mytek", logo: "MT", price: 249, url: "https://example.com/mytek-nv3" },
      { store: "Mega-PC", logo: "MPC", price: 259, url: "https://example.com/megapc-nv3" },
      { store: "Tunisianet", logo: "TN", price: 269, url: "https://example.com/tunisianet-nv3" },
    ],
    specs: {
      processor: "-",
      ram: "-",
      ssd: "1 TB",
      gpu: "-",
      screen: "-",
    },
  },
  {
    id: 110,
    name: "Samsung 990 PRO SSD 2TB",
    brand: "Samsung",
    category: "SSD",
    description: "Tres haut debit pour stations de travail exigeantes.",
    image: "/placeholder-ssd.jpg",
    offers: [
      { store: "SBS Informatique", logo: "SBS", price: 669, url: "https://example.com/sbs-990pro" },
      { store: "Mytek", logo: "MT", price: 689, url: "https://example.com/mytek-990pro" },
    ],
    specs: {
      processor: "-",
      ram: "-",
      ssd: "2 TB",
      gpu: "-",
      screen: "-",
    },
  },
  {
    id: 111,
    name: "Corsair Vengeance DDR5 32GB",
    brand: "Corsair",
    category: "RAM",
    description: "Kit DDR5 stable pour multitache et creation.",
    image: "/placeholder-ram.jpg",
    offers: [
      { store: "SBS Informatique", logo: "SBS", price: 389, url: "https://example.com/sbs-vengeance32" },
      { store: "Spacenet", logo: "SP", price: 399, url: "https://example.com/spacenet-vengeance32" },
    ],
    specs: {
      processor: "-",
      ram: "32 GB",
      ssd: "-",
      gpu: "-",
      screen: "-",
    },
  },
  {
    id: 112,
    name: "G.Skill Trident Z5 DDR5 64GB",
    brand: "G.Skill",
    category: "RAM",
    description: "Grande capacite pour rendu, VM et workflows lourds.",
    image: "/placeholder-ram.jpg",
    offers: [
      { store: "Mega-PC", logo: "MPC", price: 779, url: "https://example.com/megapc-trident64" },
      { store: "Mytek", logo: "MT", price: 799, url: "https://example.com/mytek-trident64" },
    ],
    specs: {
      processor: "-",
      ram: "64 GB",
      ssd: "-",
      gpu: "-",
      screen: "-",
    },
  },
  {
    id: 113,
    name: "LG UltraGear 27 QHD 165Hz",
    brand: "LG",
    category: "Moniteurs",
    description: "Moniteur gaming fluide avec bonne colorimetrie.",
    image: "/placeholder-monitor.jpg",
    offers: [
      { store: "Mytek", logo: "MT", price: 1179, url: "https://example.com/mytek-ultragear27" },
      { store: "Tunisianet", logo: "TN", price: 1219, url: "https://example.com/tunisianet-ultragear27" },
    ],
    specs: {
      processor: "-",
      ram: "-",
      ssd: "-",
      gpu: "-",
      screen: "27\" QHD 165Hz",
    },
  },
  {
    id: 114,
    name: "Dell G3223Q 32 4K 144Hz",
    brand: "Dell",
    category: "Moniteurs",
    description: "Grand ecran 4K pour jeu et creation detaillee.",
    image: "/placeholder-monitor.jpg",
    offers: [
      { store: "Mega-PC", logo: "MPC", price: 2499, url: "https://example.com/megapc-g3223q" },
      { store: "Wiki", logo: "WK", price: 2579, url: "https://example.com/wiki-g3223q" },
    ],
    specs: {
      processor: "-",
      ram: "-",
      ssd: "-",
      gpu: "-",
      screen: "32\" 4K 144Hz",
    },
  },
  {
    id: 115,
    name: "Apple iPad Air M3 11",
    brand: "Apple",
    category: "Tablettes",
    description: "Tablette polyvalente pour productivite et multimedia.",
    image: "/placeholder-tablet.jpg",
    offers: [
      { store: "Tunisianet", logo: "TN", price: 2799, url: "https://example.com/tunisianet-ipadair" },
      { store: "Mytek", logo: "MT", price: 2849, url: "https://example.com/mytek-ipadair" },
    ],
    specs: {
      processor: "Apple M3",
      ram: "8 GB",
      ssd: "128 GB",
      gpu: "Apple GPU 9-core",
      screen: "11\" Liquid Retina 120Hz",
    },
  },
  {
    id: 116,
    name: "Xiaomi Pad 7 Pro",
    brand: "Xiaomi",
    category: "Tablettes",
    description: "Tablette Android performante pour etudes et divertissement.",
    image: "/placeholder-tablet.jpg",
    offers: [
      { store: "Spacenet", logo: "SP", price: 1689, url: "https://example.com/spacenet-pad7pro" },
      { store: "Mytek", logo: "MT", price: 1729, url: "https://example.com/mytek-pad7pro" },
      { store: "Wiki", logo: "WK", price: 1749, url: "https://example.com/wiki-pad7pro" },
    ],
    specs: {
      processor: "Snapdragon 8s Gen 3",
      ram: "12 GB",
      ssd: "256 GB",
      gpu: "Adreno 735",
      screen: "12.1\" 3K 144Hz",
    },
  },
];

export const allCategories = Array.from(new Set(mockProducts.map((product) => product.category))).sort();
export const allBrands = Array.from(new Set(mockProducts.map((product) => product.brand))).sort();

export function getBestOffer(product: MockProduct): ProductOffer {
  return [...product.offers].sort((a, b) => a.price - b.price)[0];
}

export function getProductById(id: number) {
  return mockProducts.find((product) => product.id === id);
}

export function getSimilarProducts(productId: number, max = 4) {
  const current = getProductById(productId);
  if (!current) {
    return [];
  }

  const sameCategory = mockProducts.filter(
    (product) => product.category === current.category && product.id !== current.id,
  );

  if (sameCategory.length >= max) {
    return sameCategory.slice(0, max);
  }

  const fallback = mockProducts.filter(
    (product) => product.id !== current.id && !sameCategory.some((item) => item.id === product.id),
  );

  return [...sameCategory, ...fallback].slice(0, max);
}

export function formatPrice(price: number) {
  return `${price.toLocaleString("fr-FR")} TND`;
}
