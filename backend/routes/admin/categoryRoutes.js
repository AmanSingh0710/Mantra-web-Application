const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const publicLimiter = require("../../middleware/publicLimiter");
const adminLimiter = require("../../middleware/adminLimiter");
const categoryController = require("../../controllers/admin/categoryController");

// Public
router.get("/public", publicLimiter, categoryController.getPublicCategories);


// Admin
router.post("/", adminLimiter, auth, isAdmin("ADMIN"), categoryController.createCategory);
router.put("/:id", adminLimiter, auth, isAdmin("ADMIN"), categoryController.updateCategory);
router.delete("/:id", adminLimiter, auth, isAdmin("ADMIN"), categoryController.deleteCategory);
router.get("/", adminLimiter, auth, isAdmin("ADMIN"), categoryController.getCategories);

module.exports = router;