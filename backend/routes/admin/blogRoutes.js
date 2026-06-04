const express = require("express");
const router = express.Router();
const blogController = require("../../controllers/admin/blogController");
const upload = require("../../middleware/upload");
const isAdmin = require("../../middleware/isAdmin");
const auth = require("../../middleware/auth");
const contentLimiter = require("../../middleware/contentLimiter");
const adminLimiter = require("../../middleware/adminLimiter");
const uploadLimiter = require("../../middleware/uploadLimiter");



// Public
router.get("/", contentLimiter, blogController.getBlogs);
router.get("/:id", contentLimiter, blogController.getSingleBlog);


// Admin
router.get("/", adminLimiter, uploadLimiter, contentLimiter,auth, isAdmin("ADMIN"), blogController.getBlogs);
router.get("/:id", adminLimiter, uploadLimiter, contentLimiter,auth, isAdmin("ADMIN"),blogController.getSingleBlog);
router.post("/add", adminLimiter, uploadLimiter, auth, isAdmin("ADMIN"), upload.single("image"), blogController.createBlog);
router.put("/:id", adminLimiter, uploadLimiter, auth, isAdmin("ADMIN"), upload.single("image"), blogController.updateBlog);
router.delete("/:id", adminLimiter, uploadLimiter, auth, isAdmin("ADMIN"), blogController.deleteBlog);

module.exports = router;