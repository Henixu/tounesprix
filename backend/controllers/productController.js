const fs = require("fs");
const path = require("path");

const Product = require("../models/Product");
const Price = require("../models/Price");
const { getBestPrice } = require("../services/priceService");

function parseSpecifications(raw) {
  if (!raw) {
    return {};
  }

  if (typeof raw === "object") {
    return raw;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return {};
  }
}

function removeUploadedFile(imagePath) {
  if (!imagePath) {
    return;
  }

  fs.unlink(path.join(__dirname, "..", imagePath), () => {});
}

async function getProducts(req, res, next) {
  try {
    const { category, brand, search, minPrice, maxPrice } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (search) filter.name = { $regex: search, $options: "i" };

    const products = await Product.find(filter).sort({ createdAt: -1 });

    let productsWithBestPrice = await Promise.all(
      products.map(async (product) => ({
        ...product.toObject(),
        bestPrice: await getBestPrice(product._id),
      })),
    );

    if (minPrice !== undefined) {
      const min = Number(minPrice);
      productsWithBestPrice = productsWithBestPrice.filter(
        (item) => item.bestPrice && item.bestPrice.price >= min,
      );
    }

    if (maxPrice !== undefined) {
      const max = Number(maxPrice);
      productsWithBestPrice = productsWithBestPrice.filter(
        (item) => item.bestPrice && item.bestPrice.price <= max,
      );
    }

    res.json(productsWithBestPrice);
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Produit introuvable");
    }

    const prices = await Price.find({ productId: product._id })
      .sort({ price: 1 })
      .populate("storeId", "name logo city website");

    res.json({ ...product.toObject(), prices });
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const { name, brand, category, description, specifications } = req.body;

    if (!name || !brand || !category) {
      res.status(400);
      throw new Error("name, brand et category sont obligatoires");
    }

    const product = await Product.create({
      name,
      brand,
      category,
      description,
      specifications: parseSpecifications(specifications),
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.status(201).json(product);
  } catch (error) {
    if (req.file) removeUploadedFile(`/uploads/${req.file.filename}`);
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Produit introuvable");
    }

    const { name, brand, category, description, specifications } = req.body;

    if (name !== undefined) product.name = name;
    if (brand !== undefined) product.brand = brand;
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (specifications !== undefined) product.specifications = parseSpecifications(specifications);

    if (req.file) {
      const previousImage = product.image;
      product.image = `/uploads/${req.file.filename}`;
      removeUploadedFile(previousImage);
    }

    await product.save();
    res.json(product);
  } catch (error) {
    if (req.file) removeUploadedFile(`/uploads/${req.file.filename}`);
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Produit introuvable");
    }

    removeUploadedFile(product.image);
    await Price.deleteMany({ productId: product._id });
    await product.deleteOne();

    res.json({ message: "Produit supprime" });
  } catch (error) {
    next(error);
  }
}

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
