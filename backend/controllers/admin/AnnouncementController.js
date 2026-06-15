const Announcement = require("../../models/Announcement");

// ================= GET ALL =================
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({
        priority: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    console.error("Get Announcements Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ================= GET SINGLE =================
exports.getSingleAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    return res.status(200).json({
      success: true,
      announcement,
    });
  } catch (error) {
    console.error("Get Single Announcement Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Create
exports.createAnnouncement = async (req, res) => {
    try {

        const { title, message, buttonText,  redirectUrl, priority, backgroundColor, textColor, startDate, endDate} = req.body;

        const announcement =
            await Announcement.create({

                title,
                message,
                buttonText,
                redirectUrl,
                priority,

                backgroundColor,
                textColor,

                startDate,
                endDate,

                desktopImage: req.files?.desktopImage?.[0]
                    ? {
                        publicId:
                            req.files.desktopImage[0].filename,
                        url:
                            req.files.desktopImage[0].path
                    }
                    : null,

                mobileImage: req.files?.mobileImage?.[0]
                    ? {
                        publicId:
                            req.files.mobileImage[0].filename,
                        url:
                            req.files.mobileImage[0].path
                    }
                    : null
            });

        return res.status(201).json({
            success: true,
            message : "Announce craeted ",
            announcement
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get Active Announcement
exports.getActiveAnnouncement = async (req, res) => {

    try {

        const now = new Date();

        const announcement =
            await Announcement.findOne({

                isDeleted: false,

                isActive: true,

                $or: [
                    { startDate: null },
                    { startDate: { $lte: now } }
                ],

                $or: [
                    { endDate: null },
                    { endDate: { $gte: now } }
                ]

            })
                .sort({
                    priority: -1,
                    createdAt: -1
                });

        return res.status(200).json({
            success: true,
            announcement
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

//Updtae Announcement
exports.updateAnnouncement = async (req, res) => {

    try {

        const announcement =
            await Announcement.findById(
                req.params.id
            );

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }

        const updateData = {
            ...req.body
        };

        if (
            req.files?.desktopImage?.[0]
        ) {

            if (
                announcement.desktopImage?.publicId
            ) {
                await deleteCloudinaryFile(
                    announcement.desktopImage.publicId
                );
            }

            updateData.desktopImage = {
                publicId:
                    req.files.desktopImage[0].filename,
                url:
                    req.files.desktopImage[0].path
            };

        }

        if (req.files?.mobileImage?.[0]) {

            if (announcement.mobileImage?.publicId) { await deleteCloudinaryFile(announcement.mobileImage.publicId); }

            updateData.mobileImage = { publicId: req.files.mobileImage[0].filename, url: req.files.mobileImage[0].path };

        }

        const updated = await Announcement.findByIdAndUpdate(req.params.id, updateData, { new: true });

        res.status(200).json({
            success: true,
            announcement: updated
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

//Delete Announcement
exports.deleteAnnouncement = async (req, res) => {

        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }

        announcement.isDeleted = true;

        await announcement.save();

        res.status(200).json({
            success: true,
            message: "Deleted successfully"
        });

    };

// Active tooggle status
exports.toggleAnnouncementStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    if (!announcement.isActive) {
      // Disable all active announcements first
      await Announcement.updateMany(
        { isActive: true },
        { $set: { isActive: false } }
      );
    }

    announcement.isActive = !announcement.isActive;

    await announcement.save();

    return res.status(200).json({
      success: true,
      message: `Announcement ${
        announcement.isActive ? "activated" : "deactivated"
      } successfully`,
      announcement,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};