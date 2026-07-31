const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    return next(new Error("Non autorise, token manquant"));
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401);
      return next(new Error("Non autorise, utilisateur introuvable"));
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    next(new Error("Non autorise, token invalide"));
  }
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    return next(new Error("Acces reserve aux administrateurs"));
  }

  next();
}

module.exports = { protect, adminOnly };
