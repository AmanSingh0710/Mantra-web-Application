// controllers/deliveryBoy/deliveryBoyController.js

const DeliveryBoy = require("../../models/Deliveryman/DeliveryMan");

const Order = require("../../models/Order");


// ======================================================
// LOGIN
// ======================================================
exports.loginDeliveryBoy = async (req, res) => {
  try {

    const { email, password } = req.body;

    const deliveryBoy = await DeliveryBoy.findOne({ email, }).select("+password");

    if (!deliveryBoy) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (deliveryBoy.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account blocked",
      });
    }

    const isMatch = await deliveryBoy.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const jwt = require("jsonwebtoken");

    const token = jwt.sign(
      {
        id: deliveryBoy._id,
        role: "DELIVERY",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    deliveryBoy.lastLogin = new Date();

    deliveryBoy.status = "ONLINE";

    await deliveryBoy.save();

    deliveryBoy.password = undefined;

    res.status(200).json({
      success: true,
      token,
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
exports.getMyProfile = async (req, res) => {
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
exports.getMyOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      deliveryManId: req.user.id,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .select(
        "orderNumber pricing.grandTotal status createdAt shipping"
      );

    return res.status(200).json(orders);

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
exports.getMyStats = async (req, res) => {
  try {

    const totalOrders = await Order.countDocuments({ deliveryManId: req.user.id, });

    const completedOrders = await Order.countDocuments({ deliveryManId: req.user.id, status: "Delivered", });

    const pendingOrders = await Order.countDocuments({ deliveryManId: req.user.id, status: "Out For Delivery", });

    const profile = await DeliveryBoy.findById(req.user.id);

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
exports.getEarnings = async (req, res) => {
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
// GET TRACKING
// ======================================================
exports.getTracking = async (req, res) => {
  try {

    const orders = await Order.find({
      deliveryManId: req.user.id,
      status: {
        $in: [
          "Confirmed",
          "Processing",
          "Packed",
          "Shipped",
          "Out For Delivery",
        ],
      },
    })
      .populate("userId", "name mobile")
      .sort({ updatedAt: -1 })
      .select(
        "orderNumber shipping pricing.grandTotal status updatedAt userId"
      );

    const tracking = orders.map((order) => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      customerName: order.userId?.name || "",
      customerPhone: order.userId?.mobile || "",
      address: order.shipping.address,
      city: order.shipping.city,
      state: order.shipping.state,
      pin: order.shipping.pin,
      status: order.status,
      totalAmount: order.pricing.grandTotal,
      updatedAt: order.updatedAt,
    }));

    return res.status(200).json(tracking);

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// UPDATE LIVE LOCATION
// ======================================================
exports.updateLocation = async (req, res) => {
  try {

    const {
      latitude,
      longitude,
    } = req.body;

    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Latitude and Longitude required",
      });
    }

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
      location:
        deliveryBoy.currentLocation,
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
exports.updateOrderStatus = async (req, res) => {
  try {

    const { orderId, status, } = req.body;

    const order = await Order.findById(orderId);

    const allowedStatus = [
      "Processing",
      "Packed",
      "Shipped",
      "Out For Delivery",
      "Delivered",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    order.status = status;

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found",
      });
    }

    // ================= ASSIGNED CHECK =================
    if (!order.deliveryManId || order.deliveryManId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized order",
      });
    }

    // ================= UPDATE =================
    order.status = status;

    order.statusHistory.push({
      status,
      note: `Order status changed to ${status}`,
      updatedBy: req.user.id,
      updatedAt: new Date(),
    });

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
exports.toggleOnlineStatus = async (req, res) => {
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
exports.acceptOrder = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.deliveryManId) {
      return res.status(400).json({
        success: false,
        message:
          "Order already assigned",
      });
    }

    order.deliveryManId = req.user.id;

    order.status = "Out For Delivery";

    order.statusHistory.push({
      status: "Out For Delivery",
      note: "Order accepted by delivery partner",
      updatedBy: req.user.id,
      updatedAt: new Date(),
    });

    await order.save();

    await DeliveryBoy.findByIdAndUpdate(req.user.id,
      {
        status:
          "ON_DELIVERY",
      }
    );

    res.status(200).json({
      success: true,
      message:
        "Order accepted successfully",
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
exports.verifyDeliveryOTP = async (req, res) => {
  try {

    const { orderId, otp, } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found",
      });
    }

    if (order.deliveryOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (order.deliveryOtpVerified) {
      return res.status(400).json({
        success: false,
        message: "OTP already verified",
      });
    }


    order.status = "Delivered";
    order.deliveryOtpVerified = true;
    order.tracking.deliveredAt = new Date();

    order.statusHistory.push({
      status: "Delivered",
      note: "OTP verified successfully",
      updatedBy: req.user.id,
      updatedAt: new Date(),
    });

    await order.save();

    // earnings
    await DeliveryBoy.findByIdAndUpdate(req.user.id,
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


// change password
exports.changePassword = async (req, res) => {

  try {

    const {
      currentPassword,
      newPassword,
    } = req.body;

    const deliveryBoy =
      await DeliveryBoy.findById(
        req.user.id
      ).select("+password");

    const isMatch =
      await deliveryBoy.comparePassword(
        currentPassword
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Current password incorrect",
      });
    }

    deliveryBoy.password =
      newPassword;

    await deliveryBoy.save();

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};