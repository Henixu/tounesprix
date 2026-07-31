const Price = require("../models/Price");

async function getBestPrice(productId) {
  const [best] = await Price.find({ productId })
    .sort({ price: 1 })
    .limit(1)
    .populate("storeId", "name logo city website");

  return best || null;
}

module.exports = { getBestPrice };
