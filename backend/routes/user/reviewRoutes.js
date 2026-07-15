const express = require("express");
const router = express.Router();
const reviewController = require("../../controllers/user/reviewController");
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const contentLimiter = require("../../middleware/contentLimiter");
const adminLimiter = require("../../middleware/adminLimiter");


router.get("/public", contentLimiter, reviewController.getPublicReviews);
router.get("/", contentLimiter, auth, reviewController.getReviews);

router.get("/dropdown-products", contentLimiter, auth, reviewController.getProductDropdown);
router.get("/dropdown-customers", contentLimiter, auth, reviewController.getCustomerDropdown);
router.post("/add", contentLimiter, auth, reviewController.addReview);

router.get("/admin/all", adminLimiter, auth, isAdmin("ADMIN"), reviewController.getReviews);
router.patch("/status/:id", adminLimiter, auth, isAdmin("ADMIN"), reviewController.updateReviewStatus);

module.exports = router;