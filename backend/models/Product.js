const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom du produit est obligatoire"],
    trim: true,
  },
  brand: {
    type: String,
    required: [true, "La marque est obligatoire"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "La categorie est obligatoire"],
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  specifications: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.index({ category: 1 });

module.exports = mongoose.model("Product", productSchema);
