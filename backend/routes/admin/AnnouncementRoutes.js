const express = require("express");
const router = express.Router();

const announcementController = require("../../controllers/admin/AnnouncementController");

const auth = require("../../middleware/auth");

const isAdmin = require("../../middleware/isAdmin");

const upload = require("../../middleware/upload");

const contentLimiter = require("../../middleware/contentLimiter");

const adminLimiter = require("../../middleware/adminLimiter");

const uploadLimiter = require("../../middleware/uploadLimiter");


// ==========================================
// CREATE ANNOUNCEMENT
// ==========================================
router.post("/add", adminLimiter, uploadLimiter, auth, isAdmin("ADMIN"),
    upload.fields([
        {
            name: "desktopImage",
            maxCount: 1
        },
        {
            name: "mobileImage",
            maxCount: 1
        }
    ]),
    announcementController.createAnnouncement
);


// ==========================================
// GET ACTIVE ANNOUNCEMENT (PUBLIC)
// ==========================================
router.get("/active", contentLimiter, announcementController.getActiveAnnouncement);


// ==========================================
// GET ALL ANNOUNCEMENTS (ADMIN)
// ==========================================
router.get("/list", adminLimiter, auth, isAdmin("ADMIN"), announcementController.getAnnouncements);


// ==========================================
// GET SINGLE ANNOUNCEMENT
// ==========================================
router.get("/:id", adminLimiter, auth, isAdmin("ADMIN"), announcementController.getSingleAnnouncement);


// ==========================================
// UPDATE ANNOUNCEMENT
// ==========================================
router.put("/:id", adminLimiter, uploadLimiter, auth, isAdmin("ADMIN"),
    upload.fields([
        {
            name: "desktopImage",
            maxCount: 1
        },
        {
            name: "mobileImage",
            maxCount: 1
        }
    ]),
    announcementController.updateAnnouncement
);


// ==========================================
// TOGGLE STATUS
// ==========================================
router.patch("/toggle/:id", adminLimiter, auth, isAdmin("ADMIN"), announcementController.toggleAnnouncementStatus);


// ==========================================
// DELETE ANNOUNCEMENT
// ==========================================
router.delete("/:id", adminLimiter, auth, isAdmin("ADMIN"), announcementController.deleteAnnouncement);

module.exports = router;