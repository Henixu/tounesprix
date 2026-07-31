const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom du magasin est obligatoire"],
    trim: true,
    unique: true,
  },
  logo: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Store", storeSchema);
