const express = require("express");
const {
  getOverview,
  getByCategory,
  getByBrand,
  getBestPriceStores,
  getPriceEvolution,
} = require("../controllers/statsController");

const router = express.Router();

router.get("/overview", getOverview);
router.get("/by-category", getByCategory);
router.get("/by-brand", getByBrand);
router.get("/best-price-stores", getBestPriceStores);
router.get("/price-evolution/:productId", getPriceEvolution);

module.exports = router;
