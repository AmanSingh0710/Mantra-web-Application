
const NotificationSetting = require("../../../models/Notification/PushNotification");

exports.updateSettings = async (req, res) => {
  try {
    const { userType, ...settingsData } = req.body;

    const updated = await NotificationSetting.findOneAndUpdate(
      { userType: userType || "Customer" },
      { $set: settingsData },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: `${userType} settings updated successfully!`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating settings", error: error.message });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const { userType } = req.query;
    const settings = await NotificationSetting.findOne({ userType: userType || "Customer" });
    
    res.status(200).json({ success: true, data: settings || {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};