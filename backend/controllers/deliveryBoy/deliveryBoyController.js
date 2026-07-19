// controllers/deliveryBoy/deliveryBoyController.js

const DeliveryBoy = require("../../models/Deliveryman/DeliveryMan");
const Order = require("../../models/Order");
const Wallet = require("../../models/Finance/Wallet");
const Settlement = require("../../models/Finance/Settlement");
const WalletTransaction = require("../../models/Finance/WalletTransaction");
const DeliverySettlement = require("../../models/Finance/DeliverySettlement");
const Notification = require("../../models/Notification/SendNotification");

//helper function
const buildOrderQuery = (deliveryId, query) => {

  const filter = {
    deliveryManId: deliveryId,
    isDeleted: false
  };

  if (query.status) {

    filter.status = query.status;

  }

  if (query.search) {

    filter.orderNumber = {
      $regex: query.search,
      $options: "i"
    };

  }

  return filter;

};

// pagination helper
const getPagination = (req) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);

  const limit = Math.min(parseInt(req.query.limit) || 10, 50);

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip
  };

};


// GET MY PROFILE
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

// COMPLETE ORDER
exports.getCompletedOrders = async (req, res) => {
  const { page, limit, skip } = getPagination(req);

  const filter = { deliveryManId: req.user.id, status: "Delivered" };

  const orders = await Order.find(filter)
    .populate("userId", "name mobile profileImage")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(filter);

  return res.json({
    success: true,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    total,
    orders
  });
};

// GET MY ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const filter = buildOrderQuery(req.user.id, req.query);
    const orders = await Order.find(filter)
      .populate("userId", "name mobile")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await Order.countDocuments(filter);
    return res.json({
      success: true,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total,
      orders
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

//GET CANCEL OREDER
exports.getCancelledOrders = async (req, res) => {
  const orders = await Order.find({
    deliveryManId: req.user.id,
    status: "Cancelled"
  })
    .populate("userId", "name mobile")
    .sort({ updatedAt: -1 });
  res.json({
    success: true,
    orders
  });
};

//GET RETURN OREDER
exports.getReturnedOrders = async (req, res) => {
  const orders = await Order.find({
    deliveryManId: req.user.id,
    status: "Returned"
  })
    .populate("userId", "name mobile")
    .sort({ updatedAt: -1 });
  res.json({
    success: true,
    orders
  });
};

// GET MY STATS
exports.getMyStats = async (req, res) => {
  try {

    const totalOrders = await Order.countDocuments({ deliveryManId: req.user.id, });

    const completedOrders = await Order.countDocuments({ deliveryManId: req.user.id, status: "Delivered", });

    const pendingOrders = await Order.countDocuments({ deliveryManId: req.user.id, status: { $in: ["Confirmed", "Processing", "Packed", "Shipped", "Out For Delivery"] } });

    const profile = await DeliveryBoy.findById(req.user.id);

    const wallet = await Wallet.findOne({ userId: req.user.id, userType: "DeliveryMan" });

    res.status(200).json({
      totalDeliveries: profile.totalDeliveries || 0,
      walletBalance: wallet?.balance || 0,
      totalEarnings: profile.totalEarnings || 0,
      pendingOrders,
      completedOrders,
      totalOrders
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// DELIVERYBOY BOY DASHBOARD
exports.getDashboard = async (req, res) => {
  try {
    const profile = await DeliveryBoy.findById(req.user.id).select(
      "status totalDeliveries walletBalance totalEarnings todayDeliveries todayEarnings monthlyEarnings averageRating"
    );
    const activeOrders = await Order.countDocuments({
      deliveryManId: req.user.id,
      status: "Out For Delivery"
    });
    const assignedOrders = await Order.countDocuments({
      deliveryManId: req.user.id,
      status: "Shipped"
    });
    const completedOrders = await Order.countDocuments({
      deliveryManId: req.user.id,
      status: "Delivered"
    });
    return res.json({
      success: true,
      dashboard: {
        onlineStatus: profile.status,
        walletBalance: profile.walletBalance,
        totalEarnings: profile.totalEarnings,
        todayEarnings: profile.todayEarnings,
        monthlyEarnings: profile.monthlyEarnings,
        todayDeliveries: profile.todayDeliveries,
        totalDeliveries: profile.totalDeliveries,
        averageRating: profile.averageRating,
        activeOrders,
        assignedOrders,
        completedOrders
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// GET EARNINGS
exports.getEarnings = async (req, res) => {
  try {
    const profile = await DeliveryBoy.findById(req.user.id);
    const wallet = await Wallet.findOne({
      userId: req.user.id,
      userType: "DeliveryMan"
    });
    const settlements = await Settlement.countDocuments({
      deliveryBoyId: req.user.id,
      status: "Pending"
    });
    return res.json({
      success: true,
      earnings: {
        walletBalance: wallet?.balance || 0,
        pendingBalance: wallet?.pendingBalance || 0,
        todayEarnings: profile.todayEarnings,
        monthlyEarnings: profile.monthlyEarnings,
        totalEarnings: profile.totalEarnings,
        pendingSettlements: settlements
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// GET TRACKING
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

// UPDATE LIVE LOCATION
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

// UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  try {

    const { orderId, status, } = req.body;

    const order = await Order.findById(orderId);

    const allowedStatus = [
      "Processing",
      "Packed",
      "Shipped",
      "Out For Delivery",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
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

// TOGGLE ONLINE / OFFLINE
exports.toggleOnlineStatus = async (req, res) => {
  try {

    const deliveryBoy = await DeliveryBoy.findById(req.user.id);

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found"
      });
    }

    if (deliveryBoy.status === "ON_DELIVERY") {
      return res.status(400).json({
        success: false,
        message: "Cannot go offline while delivering an order."
      });
    }

    deliveryBoy.status = deliveryBoy.status === "ONLINE"
      ? "OFFLINE"
      : "ONLINE";

    await deliveryBoy.save();

    return res.json({
      success: true,
      status: deliveryBoy.status
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

// ACCEPT ORDER
exports.acceptOrder = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.deliveryManId) {
      return res.status(400).json({
        success: false,
        message: "Order not assigned."
      });
    }

    if (order.deliveryManId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
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

// VERIFY DELIVERY OTP
exports.verifyDeliveryOTP = async (req, res) => {
  try {

    const { orderId, otp, } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const earning = order.pricing?.deliveryCharge || 0;

    if (order.deliveryOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (new Date() > order.deliveryOtpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    if (order.deliveryOtpVerified) {
      return res.status(400).json({
        success: false,
        message: "OTP already verified",
      });
    }

    order.deliveryOtp = null;
    order.deliveryOtpExpiresAt = null;


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
          todayDeliveries: 1,
          walletBalance: earning,
          todayEarnings: earning,
          monthlyEarnings: earning,
          totalEarnings: earning
        },
        activeOrder: null,
        status: "ONLINE"
      }
    );

    let wallet = await Wallet.findOne({
      userId: req.user.id,
      userType: "DeliveryMan"
    });
    if (!wallet) {
      wallet = await Wallet.create({
        userId: req.user.id,
        userType: "DeliveryMan"
      });
    }

    const openingBalance = wallet.balance;
    wallet.balance += earning;
    wallet.pendingBalance += earning;
    wallet.totalCredited += earning;

    const transaction = await WalletTransaction.create({
      walletId: wallet._id,
      userId: req.user.id,
      userType: "DeliveryMan",
      type: "CREDIT",
      amount: earning,
      openingBalance,
      balanceAfterTransaction: wallet.balance,
      description: "Delivery Completed",
      referenceId: order.orderNumber,
      balanceAfterTransaction: wallet.balance
    });

    wallet.lastTransactionId = transaction._id;
    await wallet.save();

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

//GET ASSIGN ORDER
exports.getAssignedOrders = async (req, res) => {

  const { page, limit, skip } = getPagination(req);

  const filter = { deliveryManId: req.user.id, status: "Shipped" };

  const orders = await Order.find(filter)
    .populate("userId", "name mobile profileImage")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(filter);

  res.json({
    success: true,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    total,
    orders
  });

}

//GET ACTIVE ORDERS
exports.getActiveOrders = async (req, res) => {

  const { page, limit, skip } = getPagination(req);

  const filter = buildOrderQuery(req.user.id, req.query);

  filter.status = "Out For Delivery";

  const orders = await Order.find(filter)
    .populate("userId", "name mobile profileImage")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(filter);

  return res.json({
    success: true,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    total,
    orders
  });

}

//GET WALLET
exports.getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({
      userId: req.user.id,
      userType: "DeliveryMan"
    });
    if (!wallet) {
      return res.json({
        success: true,
        wallet: null
      });
    }
    res.json({
      success: true,
      data: wallet
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// GET WALLET HISTORY
exports.getWalletHistory = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({
      userId: req.user.id,
      userType: "DeliveryMan"
    });
    if (!wallet) {
      return res.json({
        success: true,
        transactions: []
      });
    }
    const history = await WalletTransaction.find({
      walletId: wallet._id
    })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({
      success: true,
      history
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

//GET SETTLEMENT HISTORY
exports.getSettlementHistory = async (req, res) => {
  try {
    const settlements = await Settlement.find({
      deliveryBoyId: req.user.id
    })
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      settlements
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// GET REQUEST SETTLEMENT
exports.requestSettlement = async (req, res) => {
  try {
    const { amount } = req.body;
    const wallet = await Wallet.findOne({
      userId: req.user.id,
      userType: "DeliveryMan"
    });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found"
      });
    }
    if (amount > wallet.balance) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance"
      });
    }
    const profile = await DeliveryBoy.findById(req.user.id);
    const settlement = await DeliverySettlement.create({
      deliveryBoyId: req.user.id,
      walletId: wallet._id,
      amount,
      paymentMethod: profile.upiId ? "UPI" : "BANK",
      accountHolderName: profile.accountHolderName,
      bankName: profile.bankName,
      accountNumber: profile.accountNumber,
      ifscCode: profile.ifscCode,
      upiId: profile.upiId
    });
    wallet.balance -= amount;
    wallet.pendingBalance += amount;
    wallet.totalDebited += amount;
    await wallet.save();
    return res.json({
      success: true,
      message: "Settlement Request Submitted",
      settlement
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// DELIVERY ANALYTICS
exports.getDeliveryAnalytics = async (req, res) => {
  try {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));
      const delivered = await Order.countDocuments({
        deliveryManId: req.user.id,
        status: "Delivered",
        updatedAt: {
          $gte: start,
          $lte: end
        }
      });
      const earning = delivered * 50;
      last7Days.push({
        day: start.toLocaleDateString("en-IN", {
          weekday: "short"
        }),
        deliveries: delivered,
        earnings: earning
      });
    }
    return res.json({
      success: true,
      analytics: last7Days
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// GET DELIVERY BOY NOTIFICATIONS
exports.getDeliveryNotifications = async (req, res) => {
  try {

    const notifications = await Notification.find({
      $or: [
        {
          userId: req.user.id
        },
        {
          role: "DELIVERY"
        }
      ]
    })
      .sort({
        createdAt: -1
      })
      .limit(20);


    return res.status(200).json({
      success: true,
      notifications
    });


  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
