const Price = require("../models/Price");
const Product = require("../models/Product");
const Store = require("../models/Store");
const { getBestPrice } = require("../services/priceService");

async function createPrice(req, res, next) {
  try {
    const { productId, storeId, price, date } = req.body;

    if (!productId || !storeId || price === undefined) {
      res.status(400);
      throw new Error("productId, storeId et price sont obligatoires");
    }

    const [product, store] = await Promise.all([
      Product.findById(productId),
      Store.findById(storeId),
    ]);

    if (!product) {
      res.status(404);
      throw new Error("Produit introuvable");
    }

    if (!store) {
      res.status(404);
      throw new Error("Magasin introuvable");
    }

    const newPrice = await Price.create({ productId, storeId, price, date });
    await newPrice.populate("storeId", "name logo city website");

    res.status(201).json(newPrice);
  } catch (error) {
    next(error);
  }
}

async function getPricesByProduct(req, res, next) {
  try {
    const { productId } = req.params;

    const prices = await Price.find({ productId })
      .sort({ price: 1 })
      .populate("storeId", "name logo city website");

    res.json(prices);
  } catch (error) {
    next(error);
  }
}

async function getBestPriceForProduct(req, res, next) {
  try {
    const { productId } = req.params;
    const best = await getBestPrice(productId);

    if (!best) {
      res.status(404);
      throw new Error("Aucun prix trouve pour ce produit");
    }

    res.json(best);
  } catch (error) {
    next(error);
  }
}

module.exports = { createPrice, getPricesByProduct, getBestPriceForProduct };
