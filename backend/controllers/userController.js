const jwt = require("jsonwebtoken");
const User = require("../models/User");

function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Nom, email et mot de passe sont obligatoires");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409);
      throw new Error("Un compte existe deja avec cet email");
    }

    const user = await User.create({ name, email, password, role: "user" });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email et mot de passe sont obligatoires");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error("Email ou mot de passe incorrect");
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
}

async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body;

    if (!["admin", "user"].includes(role)) {
      res.status(400);
      throw new Error("Role invalide");
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("Utilisateur introuvable");
    }

    user.role = role;
    await user.save();

    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    if (req.params.id === req.user._id.toString()) {
      res.status(400);
      throw new Error("Vous ne pouvez pas supprimer votre propre compte");
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("Utilisateur introuvable");
    }

    await user.deleteOne();
    res.json({ message: "Utilisateur supprime" });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, getUsers, updateUserRole, deleteUser };
