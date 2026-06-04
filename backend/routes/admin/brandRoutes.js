const express = require("express");
const router = express.Router();
const brandController = require("../../controllers/admin/brandController");
const isAdmin = require("../../middleware/isAdmin");
const auth = require("../../middleware/auth");

router.post("/", auth, isAdmin("ADMIN"), brandController.createBrand);
router.get("/", auth, isAdmin("ADMIN"), brandController.getBrands);
router.put("/:id", auth,  isAdmin("ADMIN"), brandController.updateBrand);
router.patch("/status/:id", auth,  isAdmin("ADMIN"), brandController.updateStatus); // Status ke liye PATCH ya PUT
router.delete("/:id", auth, isAdmin("ADMIN"), brandController.deleteBrand);

module.exports = router;