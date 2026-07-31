import { formatPrice, getBestOffer, mockProducts } from "@/mock/catalogData";

export const dashboardStores = Array.from(
  new Set(mockProducts.flatMap((product) => product.offers.map((offer) => offer.store))),
).sort();

export const dashboardStats = (() => {
  const bestOffers = mockProducts.map((product) => ({ product, offer: getBestOffer(product) }));
  const cheapest = [...bestOffers].sort((a, b) => a.offer.price - b.offer.price)[0];
  const mostExpensive = [...bestOffers].sort((a, b) => b.offer.price - a.offer.price)[0];
  const averagePrice = Math.round(
    bestOffers.reduce((total, item) => total + item.offer.price, 0) / bestOffers.length,
  );

  return {
    productCount: mockProducts.length,
    storeCount: dashboardStores.length,
    averagePrice,
    cheapest,
    mostExpensive,
  };
})();

export const priceEvolution = (() => {
  const base = dashboardStats.averagePrice;
  const months = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aou"];

  return months.map((month, index) => {
    const seasonalWave = [0.04, 0.02, -0.01, -0.03, -0.02, 0.01, 0.0, 0.03][index] ?? 0;
    const trend = 1.05 - index * 0.008;
    return {
      month,
      price: Math.round(base * (trend + seasonalWave)),
    };
  });
})();

export const categoryDistribution = Object.entries(
  mockProducts.reduce<Record<string, number>>((accumulator, product) => {
    accumulator[product.category] = (accumulator[product.category] || 0) + 1;
    return accumulator;
  }, {}),
).map(([category, count]) => ({ category, count }));

export const brandDistribution = Object.entries(
  mockProducts.reduce<Record<string, number>>((accumulator, product) => {
    accumulator[product.brand] = (accumulator[product.brand] || 0) + 1;
    return accumulator;
  }, {}),
).map(([brand, count]) => ({ brand, count }));

export const storeBestPriceCounts = dashboardStores.map((store) => ({
  store,
  count: mockProducts.filter((product) => getBestOffer(product).store === store).length,
}));

export const adminFormDefaults = {
  productName: "",
  storeName: "",
  priceValue: "",
};

export { formatPrice };
