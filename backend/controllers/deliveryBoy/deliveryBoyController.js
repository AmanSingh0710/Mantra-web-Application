// controllers/deliveryBoy/deliveryBoyController.js

const DeliveryBoy = require("../../models/Deliveryman/DeliveryMan");

const Order = require("../../models/Order");

const bcrypt = require("bcryptjs");

// ======================================================
// LOGIN
// ======================================================
exports.loginDeliveryBoy =
async (req, res) => {
  try {

    const { email, password } =
      req.body;

    // ================= CHECK USER =================
    const deliveryBoy =
      await DeliveryBoy.findOne({
        email,
      });

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message:
          "Delivery boy not found",
      });
    }

    // ================= BLOCK CHECK =================
    if (deliveryBoy.isBlocked) {
      return res.status(403).json({
        success: false,
        message:
          "Account blocked by admin",
      });
    }

    // ================= PASSWORD MATCH =================
    const isMatch =
      await bcrypt.compare(
        password,
        deliveryBoy.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    // ================= STATUS =================
    deliveryBoy.lastLogin =
      new Date();

    deliveryBoy.status =
      "ONLINE";

    await deliveryBoy.save();

    res.status(200).json({
      success: true,
      message:
        "Login successful",
      deliveryBoy,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// GET MY PROFILE
// ======================================================
exports.getMyProfile =
async (req, res) => {
  try {

    const deliveryBoy =
      await DeliveryBoy.findById(
        req.user.id
      ).select("-password");

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message:
          "Profile not found",
      });
    }

    res.status(200).json(
      deliveryBoy
    );

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// GET MY ORDERS
// ======================================================
exports.getMyOrders =
async (req, res) => {
  try {

    const orders =
      await Order.find({
        deliveryBoy:
          req.user.id,
      })
        .sort({
          createdAt: -1,
        });

    res.status(200).json(
      orders
    );

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// GET MY STATS
// ======================================================
exports.getMyStats =
async (req, res) => {
  try {

    const totalOrders =
      await Order.countDocuments({
        deliveryBoy:
          req.user.id,
      });

    const completedOrders =
      await Order.countDocuments({
        deliveryBoy:
          req.user.id,

        deliveryStatus:
          "DELIVERED",
      });

    const pendingOrders =
      await Order.countDocuments({
        deliveryBoy:
          req.user.id,

        deliveryStatus:
          "OUT_FOR_DELIVERY",
      });

    const profile =
      await DeliveryBoy.findById(
        req.user.id
      );

    res.status(200).json({
      totalDeliveries:
        profile.totalDeliveries,

      walletBalance:
        profile.walletBalance,

      pendingOrders,

      completedOrders,

      totalOrders,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// GET EARNINGS
// ======================================================
exports.getEarnings =
async (req, res) => {
  try {

    const profile =
      await DeliveryBoy.findById(
        req.user.id
      );

    res.status(200).json({
      walletBalance:
        profile.walletBalance,

      totalEarnings:
        profile.totalEarnings,

      pendingPayout:
        profile.pendingPayout,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// UPDATE LIVE LOCATION
// ======================================================
exports.updateLocation =
async (req, res) => {
  try {

    const {
      longitude,
      latitude,
    } = req.body;

    const deliveryBoy =
      await DeliveryBoy.findByIdAndUpdate(
        req.user.id,
        {
          currentLocation: {
            type: "Point",

            coordinates: [
              longitude,
              latitude,
            ],
          },
        },
        {
          new: true,
        }
      );

    res.status(200).json({
      success: true,
      message:
        "Location updated",
      deliveryBoy,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// UPDATE ORDER STATUS
// ======================================================
exports.updateOrderStatus =
async (req, res) => {
  try {

    const {
      orderId,
      deliveryStatus,
    } = req.body;

    const order =
      await Order.findById(
        orderId
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found",
      });
    }

    // ================= ASSIGNED CHECK =================
    if (
      order.deliveryBoy.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized order",
      });
    }

    // ================= UPDATE =================
    order.deliveryStatus =
      deliveryStatus;

    // ================= DELIVERED =================
    if (
      deliveryStatus ===
      "DELIVERED"
    ) {

      order.status =
        "Delivered";

      const deliveryBoy =
        await DeliveryBoy.findById(
          req.user.id
        );

      deliveryBoy.totalDeliveries += 1;

      deliveryBoy.walletBalance += 50;

      deliveryBoy.totalEarnings += 50;

      await deliveryBoy.save();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message:
        "Order updated successfully",
      order,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// TOGGLE ONLINE / OFFLINE
// ======================================================
exports.toggleOnlineStatus =
async (req, res) => {
  try {

    const deliveryBoy =
      await DeliveryBoy.findById(
        req.user.id
      );

    deliveryBoy.status =
      deliveryBoy.status ===
      "ONLINE"
        ? "OFFLINE"
        : "ONLINE";

    await deliveryBoy.save();

    res.status(200).json({
      success: true,
      status:
        deliveryBoy.status,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// ACCEPT ORDER
// ======================================================
exports.acceptOrder =
async (req, res) => {
  try {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found",
      });
    }

    order.deliveryBoy =
      req.user.id;

    order.deliveryStatus =
      "OUT_FOR_DELIVERY";

    await order.save();

    // update delivery boy status
    await DeliveryBoy.findByIdAndUpdate(
      req.user.id,
      {
        status:
          "ON_DELIVERY",
      }
    );

    res.status(200).json({
      success: true,
      message:
        "Order accepted",
      order,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// VERIFY DELIVERY OTP
// ======================================================
exports.verifyDeliveryOTP =
async (req, res) => {
  try {

    const {
      orderId,
      otp,
    } = req.body;

    const order =
      await Order.findById(
        orderId
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found",
      });
    }

    if (
      order.deliveryOTP !== otp
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid OTP",
      });
    }

    order.deliveryStatus =
      "DELIVERED";

    order.status =
      "Delivered";

    await order.save();

    // earnings
    await DeliveryBoy.findByIdAndUpdate(
      req.user.id,
      {
        $inc: {
          totalDeliveries: 1,
          walletBalance: 50,
          totalEarnings: 50,
        },

        status: "ONLINE",
      }
    );

    res.status(200).json({
      success: true,
      message:
        "Delivery completed successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};