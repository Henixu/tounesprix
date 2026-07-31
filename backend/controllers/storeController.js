const Store = require("../models/Store");
const Price = require("../models/Price");

async function getStores(req, res, next) {
  try {
    const stores = await Store.find().sort({ name: 1 });
    res.json(stores);
  } catch (error) {
    next(error);
  }
}

async function getStoreById(req, res, next) {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      res.status(404);
      throw new Error("Magasin introuvable");
    }

    res.json(store);
  } catch (error) {
    next(error);
  }
}

async function createStore(req, res, next) {
  try {
    const { name, logo, city, website } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("Le nom du magasin est obligatoire");
    }

    const existing = await Store.findOne({ name });
    if (existing) {
      res.status(409);
      throw new Error("Ce magasin existe deja");
    }

    const store = await Store.create({ name, logo, city, website });
    res.status(201).json(store);
  } catch (error) {
    next(error);
  }
}

async function updateStore(req, res, next) {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      res.status(404);
      throw new Error("Magasin introuvable");
    }

    const { name, logo, city, website } = req.body;

    if (name !== undefined) store.name = name;
    if (logo !== undefined) store.logo = logo;
    if (city !== undefined) store.city = city;
    if (website !== undefined) store.website = website;

    await store.save();
    res.json(store);
  } catch (error) {
    next(error);
  }
}

async function deleteStore(req, res, next) {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      res.status(404);
      throw new Error("Magasin introuvable");
    }

    await Price.deleteMany({ storeId: store._id });
    await store.deleteOne();

    res.json({ message: "Magasin supprime" });
  } catch (error) {
    next(error);
  }
}

module.exports = { getStores, getStoreById, createStore, updateStore, deleteStore };
