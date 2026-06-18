const cloudinary = require("../../../utils/cloudinary");
const Notification = require("../../../models/Notification/SendNotification");
const NotificationRead = require("../../../models/Notification/NotificationRead");

exports.createNotification = async (req, res) => {
  try {
    const { title, description, type = "GENERAL", isGlobal = true, } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const notification = await Notification.create({
      title: title.trim(),
      description: description.trim(),


      image: req.file?.path || "",
      imagePublicId: req.file?.filename || "",

      type,
      isGlobal:
        isGlobal === true ||
        isGlobal === "true",
    });

    return res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      data: notification,
    });

  } catch (error) {
    console.error("Create Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create notification"
    });
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const list = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.sendToUser = async (req, res) => {
  try {
    const { title, description, userId, type } = req.body;

    const notification = await Notification.create({
      title,
      description,
      type: type || "GENERAL",
      user: userId,
      isGlobal: false,
      isRead: false,
    });

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Failed to send notification" });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {

    const userId = req.user.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const notifications = await Notification.find({
      $or: [
        { isGlobal: true },
        { user: userId }
      ]
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const notificationIds =
      notifications.map(item => item._id);

    const readRecords =
      await NotificationRead.find({
        userId,
        notificationId: {
          $in: notificationIds
        }
      }).select("notificationId");

    const readSet = new Set(
      readRecords.map(
        item => item.notificationId.toString()
      )
    );

    const finalData =
      notifications.map(item => ({
        ...item,
        isRead: readSet.has(item._id.toString())
      }));

    res.status(200).json({
      success: true,
      data: finalData
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Delete image from cloudinary
    if (notification.imagePublicId) {
      await cloudinary.uploader.destroy(
        notification.imagePublicId
      );
    }

    await notification.deleteOne();
    await NotificationRead.deleteMany({
      notificationId: notification._id
    });

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resendNotification = async (req, res) => {

  try {

    const oldNotification = await Notification.findById(req.params.id);

    if (!oldNotification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    const newNotification = await Notification.create({
      title: oldNotification.title,
      description: oldNotification.description,
      image: oldNotification.image,
      type: oldNotification.type,
      isGlobal: oldNotification.isGlobal,
      user: oldNotification.user,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      message: "Notification resent",
      data: newNotification
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.markAsRead = async (req, res) => {
  try {

    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    await NotificationRead.findOneAndUpdate(
      {
        notificationId: id,
        userId
      },
      {
        notificationId: id,
        userId,
        readAt: new Date()
      },
      {
        upsert: true,
        new: true
      }
    );

    res.status(200).json({
      success: true,
      message: "Notification marked as read"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.getUnreadCount = async (req, res) => {
  try {

    const userId = req.user.id;

    const notifications = await Notification.find({
      $or: [
        { isGlobal: true },
        { user: userId }
      ]
    }).select("_id");

    const ids = notifications.map(
      item => item._id
    );

    const readCount =
      await NotificationRead.countDocuments({
        userId,
        notificationId: {
          $in: ids
        }
      });

    res.status(200).json({
      success: true,
      unreadCount: ids.length - readCount
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};