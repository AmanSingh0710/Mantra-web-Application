const express = require("express");
const router = express.Router();
const bannerController = require("../../controllers/admin/bannerController");
const upload = require("../../middleware/upload");
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");

// without login user
router.get("/public", bannerController.getBanners);

//only admin
router.post("/", auth, isAdmin("ADMIN"), upload.single("image"),  bannerController.createBanner);
router.get("/", auth, isAdmin("ADMIN"), bannerController.getBanners);
router.patch("/toggle/:id", auth, isAdmin("ADMIN"), bannerController.toggleBannerStatus); 
router.delete("/:id", auth, isAdmin("ADMIN"), bannerController.deleteBanner);
router.put("/:id", auth, isAdmin("ADMIN"), upload.single("image"),  bannerController.updateBanner);

module.exports = router;