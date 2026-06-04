const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const cartController = require("../../controllers/user/cartController");

// Get user cart
router.get("/", auth, cartController.getCart);

// Add/update product
router.post("/add", auth, cartController.addToCart);

// Remove product
router.post("/remove", auth, cartController.removeFromCart);

// Clear cart
router.delete("/clear", auth, cartController.clearCart);

module.exports = router;
