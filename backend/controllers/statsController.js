const Product = require("../models/Product");
const Store = require("../models/Store");
const Price = require("../models/Price");

async function getOverview(req, res, next) {
  try {
    const [productCount, storeCount] = await Promise.all([
      Product.countDocuments(),
      Store.countDocuments(),
    ]);

    const bestPrices = await Price.aggregate([
      { $sort: { price: 1 } },
      {
        $group: {
          _id: "$productId",
          price: { $first: "$price" },
          storeId: { $first: "$storeId" },
        },
      },
    ]);

    let averagePrice = 0;
    let cheapest = null;
    let mostExpensive = null;

    if (bestPrices.length > 0) {
      const total = bestPrices.reduce((sum, item) => sum + item.price, 0);
      averagePrice = Math.round((total / bestPrices.length) * 100) / 100;

      const sorted = [...bestPrices].sort((a, b) => a.price - b.price);
      const cheapestEntry = sorted[0];
      const mostExpensiveEntry = sorted[sorted.length - 1];

      const [cheapestProduct, mostExpensiveProduct, cheapestStore, mostExpensiveStore] =
        await Promise.all([
          Product.findById(cheapestEntry._id),
          Product.findById(mostExpensiveEntry._id),
          Store.findById(cheapestEntry.storeId),
          Store.findById(mostExpensiveEntry.storeId),
        ]);

      cheapest = cheapestProduct
        ? { product: cheapestProduct, price: cheapestEntry.price, store: cheapestStore }
        : null;
      mostExpensive = mostExpensiveProduct
        ? { product: mostExpensiveProduct, price: mostExpensiveEntry.price, store: mostExpensiveStore }
        : null;
    }

    res.json({ productCount, storeCount, averagePrice, cheapest, mostExpensive });
  } catch (error) {
    next(error);
  }
}

async function getByCategory(req, res, next) {
  try {
    const results = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json(results.map((item) => ({ category: item._id, count: item.count })));
  } catch (error) {
    next(error);
  }
}

async function getByBrand(req, res, next) {
  try {
    const results = await Product.aggregate([
      { $group: { _id: "$brand", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json(results.map((item) => ({ brand: item._id, count: item.count })));
  } catch (error) {
    next(error);
  }
}

async function getBestPriceStores(req, res, next) {
  try {
    const counts = await Price.aggregate([
      { $sort: { price: 1 } },
      { $group: { _id: "$productId", storeId: { $first: "$storeId" } } },
      { $group: { _id: "$storeId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const stores = await Store.find({ _id: { $in: counts.map((item) => item._id) } });
    const storeMap = new Map(stores.map((store) => [store._id.toString(), store]));

    res.json(
      counts.map((item) => ({
        store: storeMap.get(item._id.toString()) || null,
        count: item.count,
      })),
    );
  } catch (error) {
    next(error);
  }
}

async function getPriceEvolution(req, res, next) {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Produit introuvable");
    }

    const prices = await Price.find({ productId })
      .sort({ date: 1 })
      .populate("storeId", "name logo city website");

    res.json(prices);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getOverview,
  getByCategory,
  getByBrand,
  getBestPriceStores,
  getPriceEvolution,
};
