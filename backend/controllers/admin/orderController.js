const Order = require("../../models/Order");
const DeliveryMan = require("../../models/Deliveryman/DeliveryMan");
const storeName = require("../../models/Store");
const Product = require("../../models/VendorProduct");

// CREATE ORDER (User only)
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const { shipping, products, paymentMethod, couponCode } = req.body;

    if (!shipping || !products?.length) {
      return res.status(400).json({
        success: false,
        message: "Shipping and products are required"
      });
    }

    let subtotal = 0;
    let deliveryCharge = 0;
    let tax = 0;
    let adminCommission = 0;

    const finalProducts = [];

    for (const item of products) {

      const product = await Product.findById(item.productId)
        .populate("store");

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found`
        });
      }

      if (
        product.status !== "ACTIVE" ||
        product.isDeleted
      ) {
        return res.status(400).json({
          success: false,
          message: `${product.productName} unavailable`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.productName} stock unavailable`
        });
      }

      const actualPrice =
        product.discountPrice > 0
          ? product.discountPrice
          : product.price;

      const lineTotal =
        actualPrice * item.quantity;

      subtotal += lineTotal;

      deliveryCharge +=
        product.shippingCharge || 0;

      tax += product.taxAmount || 0;

      finalProducts.push({
        productId: product._id,
        storeId: product.store,
        name: product.productName,
        image:
          product.thumbnail?.url ||
          "",
        sku: product.sku,
        price: actualPrice,
        quantity: item.quantity,
        total: lineTotal
      });
    }

    // Admin Commission 10%
    adminCommission =
      subtotal * 0.10;

    // Coupon Logic
    let discount = 0;

    if (couponCode) {
      // future coupon logic
      discount = 0;
    }

    const grandTotal =
      subtotal +
      tax +
      deliveryCharge -
      discount;

    order.deliveryOtp =
      Math.floor(
        1000 + Math.random() * 9000
      ).toString();

    order.deliveryOtpExpiresAt =
      new Date(
        Date.now() + 24 * 60 * 60 * 1000
      );

    const order = await Order.create({
      userId,

      shipping,

      products: finalProducts,

      pricing: {
        subtotal,
        tax,
        deliveryCharge,
        discount,
        adminCommission,
        grandTotal
      },

      payment: {
        method: paymentMethod,
        status:
          paymentMethod === "COD"
            ? "Pending"
            : "Paid"
      },

      deliveryOtp: otp,

      status: "Pending",

      statusHistory: [
        {
          status: "Pending",
          note: "Order placed successfully",
          updatedBy: userId
        }
      ]
    });

    // Stock Reduce
    for (const item of finalProducts) {

      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            stock: -item.quantity,
            soldCount: item.quantity,
            totalSales: item.total
          }
        }
      );
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order
    });

  } catch (error) {

    console.error(
      "Create Order Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL ORDERS (ADMIN)
exports.getAllOrders = async (req, res) => {
  try {

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 20;

    const skip =
      (page - 1) * limit;

    const query = {
      isDeleted: false
    };

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.paymentStatus) {
      query["payment.status"] =
        req.query.paymentStatus;
    }

    if (req.query.orderNumber) {
      query.orderNumber = {
        $regex: req.query.orderNumber,
        $options: "i"
      };
    }

    const [orders, total] =
      await Promise.all([

        Order.find(query)
          .populate(
            "userId",
            "name email mobile"
          )
          .sort({
            createdAt: -1
          })
          .skip(skip)
          .limit(limit),

        Order.countDocuments(query)
      ]);

    return res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      orders
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// GET USER ORDERS (User only)
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      userId,
      isDeleted: false
    };

    if (req.query.status) {
      query.status = req.query.status;
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "orderNumber status pricing.grandTotal payment.status createdAt"
        ),

      Order.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      orders
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// UPDATE ORDER STATUS (ADMIN only)
exports.updateOrderStatus = async (req, res) => {

  try {

    const { status, note } =
      req.body;

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found"
      });

    }

    const flow = {

      Pending: [
        "Confirmed",
        "Cancelled"
      ],

      Confirmed: [
        "Processing",
        "Cancelled"
      ],

      Processing: [
        "Packed"
      ],

      Packed: [
        "Shipped"
      ],

      Shipped: [
        "Out For Delivery"
      ],

      "Out For Delivery": [
        "Delivered"
      ],

      Delivered: [],

      Cancelled: [],

      Returned: [],

      Refunded: []
    };

    const allowed =
      flow[order.status] || [];

    if (
      !allowed.includes(status)
    ) {

      return res.status(400).json({
        success: false,
        message:
          `Cannot move from ${order.status} to ${status}`
      });

    }

    order.status = status;

    if (
      status === "Delivered"
    ) {

      order.tracking.deliveredAt =
        new Date();

    }

    order.statusHistory.push({
      status,
      note:
        note ||
        `Order moved to ${status}`,
      updatedBy: req.user.id
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Order status updated",
      order
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// GET DASHBOARD STATS (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = {
      orderStatus: {
        all: await Order.countDocuments(),
        pending: await Order.countDocuments({ status: "Pending" }),
        confirmed: await Order.countDocuments({ status: "Confirmed" }),
        packaging: await Order.countDocuments({ status: "Packaging" }),
        out_for_delivery: await Order.countDocuments({ status: "Out for delivery" }),
        delivered: await Order.countDocuments({ status: "Delivered" }),
        canceled: await Order.countDocuments({ status: "Canceled" }),
        returned: await Order.countDocuments({ status: "Returned" }),
        failed: await Order.countDocuments({ status: "Failed to delivery" }),
      }
    };
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CANCEL ORDER (User only)
exports.cancelOrder = async (req, res) => {
  try {

    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (
      order.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const nonCancelableStatuses = [
      "Delivered",
      "Cancelled",
      "Returned",
      "Refunded"
    ];

    if (
      nonCancelableStatuses.includes(
        order.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Order cannot be cancelled"
      });
    }

    order.status = "Cancelled";

    order.cancelReason =
      reason || "Customer cancelled";

    order.cancelledAt =
      new Date();

    order.statusHistory.push({
      status: "Cancelled",
      note: order.cancelReason,
      updatedBy: req.user.id
    });

    // Restore stock

    for (
      const item of order.products
    ) {

      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            stock: item.quantity,
            soldCount: -item.quantity,
            totalSales: -item.total
          }
        }
      );

    }

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Order cancelled successfully",
      order
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const deleted = await Order.findByIdAndDelete(orderId);

    if (!deleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Assign Deliveryboy
exports.assignDeliveryBoy = async (req, res) => {
  try {

    const { orderId, deliveryManId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const deliveryMan =
      await DeliveryMan.findById(deliveryManId);

    if (!deliveryMan) {
      return res.status(404).json({
        success: false,
        message: "Delivery boy not found"
      });
    }

    if (deliveryMan.isBlocked) {
      return res.status(400).json({
        success: false,
        message: "Delivery boy is blocked"
      });
    }

    if (!deliveryMan.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Delivery boy is not verified"
      });
    }

    order.deliveryManId = deliveryMan._id;

    order.statusHistory.push({
      status: order.status,
      note: `Delivery boy assigned (${deliveryMan.name})`,
      updatedBy: req.user.id
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Delivery boy assigned successfully",
      order
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

//Get order deatils
exports.getOrderDetails = async (req, res) => {
  try {

    const { orderId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(orderId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id"
      });
    }

    const order = await Order.findById(orderId)
      .populate(
        "products.productId",
        "productName slug thumbnail"
      )
      .populate(
        "deliveryManId",
        "name mobile"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const isAdmin =
      req.user.role === "ADMIN";

    if (
      !isAdmin &&
      order.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    return res.status(200).json({
      success: true,
      order
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

//Add Tracking
exports.addTracking = async (req, res) => {

  try {

    const {
      trackingId,
      courierName,
      trackingUrl
    } = req.body;

    const order =
      await Order.findById(req.params.id);

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found"
      });

    }

    const allowedStatuses = [
      "Packed",
      "Shipped",
      "Out For Delivery"
    ];

    if (
      !allowedStatuses.includes(order.status)
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Tracking can only be added after packing"
      });

    }

    order.tracking = {
      trackingId,
      courierName,
      trackingUrl,
      shippedAt: new Date()
    };

    order.statusHistory.push({
      status: order.status,
      note: `Tracking Added (${trackingId})`,
      updatedBy: req.user.id
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Tracking updated",
      order
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

//Verify Delivery Otp
exports.verifyDeliveryOTP = async (req, res) => {

  try {

    const {
      orderId,
      otp
    } = req.body;

    const order =
      await Order.findById(orderId);

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found"
      });

    }

    if (
      order.status !==
      "Out For Delivery"
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Order is not out for delivery"
      });

    }

    if (
      order.deliveryOtp !== otp
    ) {

      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });

    }

    order.deliveryOtpVerified =
      true;

    order.status =
      "Delivered";

    order.tracking.deliveredAt =
      new Date();

    order.statusHistory.push({
      status: "Delivered",
      note:
        "OTP verified. Order delivered.",
      updatedBy: req.user.id
    });

    await order.save();

    // Delivery stats update

    if (
      order.deliveryManId
    ) {

      await DeliveryMan.findByIdAndUpdate(
        order.deliveryManId,
        {
          $inc: {
            totalDeliveries: 1
          },
          status: "ONLINE"
        }
      );

    }

    return res.status(200).json({
      success: true,
      message:
        "Delivery OTP verified successfully",
      order
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

//Request Return
exports.requestReturn = async (req, res) => {

  try {

    const {
      reason,
      images
    } = req.body;

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found"
      });

    }

    if (
      order.userId.toString() !==
      req.user.id
    ) {

      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });

    }

    if (
      order.status !==
      "Delivered"
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Only delivered orders can be returned"
      });

    }

    if (
      order.returnRequest
        ?.requested
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Return already requested"
      });

    }

    order.returnRequest = {

      requested: true,

      reason,

      images,

      approved: false,

      requestedAt:
        new Date()

    };

    order.status =
      "Return Requested";

    order.statusHistory.push({
      status:
        "Return Requested",
      note: reason,
      updatedBy:
        req.user.id
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Return request submitted"
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

//Approved Return
exports.approveReturn = async (req, res) => {

  try {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {

      return res.status(404).json({
        success: false,
        message:
          "Order not found"
      });

    }

    if (
      !order.returnRequest
        ?.requested
    ) {

      return res.status(400).json({
        success: false,
        message:
          "No return request found"
      });

    }

    order.returnRequest.approved =
      true;

    order.status =
      "Returned";

    order.statusHistory.push({
      status: "Returned",
      note:
        "Return approved by admin",
      updatedBy:
        req.user.id
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Return approved",
      order
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

//Add Rating
exports.addRating = async (req, res) => {

  try {

    const {
      rating,
      review
    } = req.body;

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {

      return res.status(404).json({
        success: false,
        message:
          "Order not found"
      });

    }

    if (
      order.userId.toString() !==
      req.user.id
    ) {

      return res.status(403).json({
        success: false,
        message:
          "Unauthorized"
      });

    }

    if (
      order.status !==
      "Delivered"
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Only delivered orders can be reviewed"
      });

    }

    if (
      order.productRating
        ?.rating
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Review already submitted"
      });

    }

    order.productRating = {
      rating,
      review
    };

    await order.save();

    // Update product ratings

    for (
      const item of order.products
    ) {

      const product =
        await Product.findById(
          item.productId
        );

      if (!product)
        continue;

      const totalRating =
        product.averageRating *
        product.totalReviews;

      product.totalReviews += 1;

      product.averageRating =
        (
          totalRating +
          rating
        ) /
        product.totalReviews;

      await product.save();

    }

    return res.status(200).json({
      success: true,
      message:
        "Review submitted successfully"
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

//Approved Refund 
exports.approveRefund = async (req, res) => {

  try {

    const order =
      await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success:false,
        message:"Order not found"
      });
    }

    if (
      order.status !== "Returned"
    ) {
      return res.status(400).json({
        success:false,
        message:"Return not completed"
      });
    }

    order.refund = {
      refundId:
        "REF-" + Date.now(),

      amount:
        order.pricing.grandTotal,

      status:
        "Approved",

      refundedAt:
        new Date()
    };

    order.status =
      "Refunded";

    await order.save();

    res.status(200).json({
      success:true,
      message:"Refund approved"
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};