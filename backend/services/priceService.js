const Price = require("../models/Price");
const Store = require("../models/Store");

async function getBestPrice(productId) {
  const [best] = await Price.find({ productId })
    .sort({ price: 1 })
    .limit(1)
    .populate("storeId", "name logo city website");

  return best || null;
}

async function getBestPricesForProducts(productIds) {
  const bestPrices = await Price.aggregate([
    { $match: { productId: { $in: productIds } } },
    { $sort: { price: 1 } },
    {
      $group: {
        _id: "$productId",
        priceId: { $first: "$_id" },
        price: { $first: "$price" },
        storeId: { $first: "$storeId" },
        date: { $first: "$date" },
      },
    },
  ]);

  const stores = await Store.find({
    _id: { $in: bestPrices.map((item) => item.storeId) },
  }).select("name logo city website");
  const storeMap = new Map(stores.map((store) => [store._id.toString(), store]));

  const bestPriceMap = new Map();
  bestPrices.forEach((item) => {
    bestPriceMap.set(item._id.toString(), {
      _id: item.priceId,
      productId: item._id,
      price: item.price,
      date: item.date,
      storeId: storeMap.get(item.storeId.toString()) || null,
    });
  });

  return bestPriceMap;
}

module.exports = { getBestPrice, getBestPricesForProducts };
