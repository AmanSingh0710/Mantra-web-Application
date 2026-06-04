const express = require("express");
const router = express.Router();
const offerController = require("../../controllers/admin/offerController");
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");

// Create
router.post("/", auth, isAdmin("ADMIN"), offerController.createOffer);

// Get All
router.get("/", auth, isAdmin("ADMIN"), offerController.getAllOffers);

// Get Single
router.get("/:id", auth, isAdmin("ADMIN"), offerController.getSingleOffer);

// Update
router.put("/:id", auth, isAdmin("ADMIN"), offerController.updateOffer);

// Delete
router.delete("/:id", auth, isAdmin("ADMIN"), offerController.deleteOffer);

// ✅ Get Active Offers (Public – User Side)
router.get("/active", offerController.getActiveOffers);

module.exports = router;
