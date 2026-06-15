const express = require('express');
const router = express.Router();

const announcementController =  require("../../controllers/admin/AnnouncementController"); 
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");

const upload = require("../../middleware/upload");

const contentLimiter = require("../../middleware/contentLimiter");
const adminLimiter = require("../../middleware/adminLimiter");
const uploadLimiter = require("../../middleware/uploadLimiter");

router.post( "/add", auth, isAdmin("ADMIN"), announcementController.createAnnouncement);

router.get( "/active", announcementController.getActiveAnnouncement);