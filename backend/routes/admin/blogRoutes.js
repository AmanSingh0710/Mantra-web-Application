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
router.get("/slug/:slug", contentLimiter, blogController.getSingleBlog);


// Admin
router.get("/admin", adminLimiter, uploadLimiter, contentLimiter,auth, isAdmin("ADMIN"), blogController.getAllBlogsAdmin);
router.get("/admin/:id", adminLimiter, uploadLimiter, contentLimiter,auth, isAdmin("ADMIN"),blogController.getSingleBlogAdmin);
router.post("/admin/add", adminLimiter, uploadLimiter, auth, isAdmin("ADMIN"), upload.single("image"), blogController.createBlog);
router.put("/admin/:id", adminLimiter, uploadLimiter, auth, isAdmin("ADMIN"), upload.single("image"), blogController.updateBlog);
router.delete("/admin/:id", adminLimiter, uploadLimiter, auth, isAdmin("ADMIN"), blogController.deleteBlog);

module.exports = router;