const express = require("express");
const {
  register,
  login,
  getUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", protect, adminOnly, getUsers);
router.put("/:id/role", protect, adminOnly, updateUserRole);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
