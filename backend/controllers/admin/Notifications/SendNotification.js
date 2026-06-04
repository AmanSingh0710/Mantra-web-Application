
const Notification = require("../../../models/Notification/SendNotification");

exports.createNotification = async (req, res) => {
  try {
    const { title, description, type, isGlobal } = req.body;
    const imagePath = req.file ? `/uploads/notifications/${req.file.filename}` : "";

    const newNotif = new Notification({
      title,
      description,
      image: imagePath,
      type: type || "GENERAL",
      isGlobal: isGlobal === 'true'
    });

    await newNotif.save();
    res.status(201).json({ success: true, message: "Manual Notification Sent!", data: newNotif });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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
    const page = parseInt(req.query.page) || 1;
    const limit = 20;

    const list = await Notification.find({
      $or: [
        { isGlobal: true },
        { user: userId }
      ]
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: list
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, { isRead: true });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to update" });
  }
};