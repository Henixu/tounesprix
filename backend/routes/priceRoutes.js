const express = require("express");
const {
  createPrice,
  getPricesByProduct,
  getBestPriceForProduct,
} = require("../controllers/priceController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, adminOnly, createPrice);
router.get("/product/:productId", getPricesByProduct);
router.get("/product/:productId/best", getBestPriceForProduct);

module.exports = router;
