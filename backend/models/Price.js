const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Le produit est obligatoire"],
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: [true, "Le magasin est obligatoire"],
  },
  price: {
    type: Number,
    required: [true, "Le prix est obligatoire"],
    min: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

priceSchema.index({ productId: 1 });
priceSchema.index({ productId: 1, storeId: 1 });

module.exports = mongoose.model("Price", priceSchema);
