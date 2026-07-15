const express = require('express');
const router = express.Router();
const storyController = require('../../controllers/admin/storyController');

const auth  = require('../../middleware/auth'); 
const isAdmin  = require('../../middleware/isAdmin'); 
const upload = require("../../middleware/upload");
const contentLimiter = require("../../middleware/contentLimiter");
const adminLimiter = require("../../middleware/adminLimiter");
const uploadLimiter = require("../../middleware/uploadLimiter");



// Public route for the frontend homepage
router.get('/', contentLimiter,storyController.getStories);
router.get("/:id", contentLimiter, storyController.getSingleStory);

// Protected Admin-only routes for content management
router.get('/:id', adminLimiter,auth, isAdmin('ADMIN'), storyController.getSingleStory);
router.post('/add', adminLimiter,uploadLimiter,auth, isAdmin('ADMIN'),  upload.single("image"), storyController.createStory);
router.patch('/:id', adminLimiter,uploadLimiter,auth, isAdmin('ADMIN'),  upload.single("image"), storyController.updateStory);
router.delete('/:id', adminLimiter,auth, isAdmin('ADMIN'), storyController.deleteStory);

module.exports = router;