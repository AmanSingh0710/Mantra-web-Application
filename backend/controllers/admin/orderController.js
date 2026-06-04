const Order = require("../../models/Order");
const DeliveryMan = require("../../models/Deliveryman/DeliveryMan");
const storeName = require("../../models/Store");

// CREATE ORDER (User only)
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { shipping, products, totalAmount, paymentMethod, storeId, deliveryCharge } = req.body;
    const adminCommission = totalAmount * 0.1;
    const tax = totalAmount * 0.05;

    // Validate required fields manually (additional check)
    if (!shipping || !products || !totalAmount || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const order = await Order.create({
      userId,
      storeId,
      shipping,
      products,
      totalAmount,
      paymentMethod,
      adminCommission,
      tax,
      deliveryCharge,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      status: "Pending",
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
   
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET ALL ORDERS (ADMIN)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name mobile email")
      .populate("products.productId", "name price image")
      .populate("deliveryManId", "firstName lastName phoneNumber")
      .populate("storeId", "shopName shopAddress");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET USER ORDERS (User only)
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("products.productId", "name price");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ORDER STATUS (ADMIN only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Dashboard aur Frontend se match hone waale saare status yahan hone chahiye
    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Packaging",
      "Out for delivery",
      "Delivered",
      "Canceled",
      "Returned",
      "Failed to delivery"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Try: ${allowedStatuses.join(", ")}` });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only the owner can cancel
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only cancel your own orders" });
    }

    // Cannot cancel if already delivered or cancelled
    if (order.status === "Delivered") {
      return res.status(400).json({ message: "Delivered orders cannot be cancelled" });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

exports.assignDeliveryMan = async (req, res) => {
  try {
  
    const { orderId, deliveryManId } = req.body;

   const order = await Order.findById(orderId);
   

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // agar pehle se assign hai to increment mat karo
    if (!order.deliveryManId) {
      await DeliveryMan.findByIdAndUpdate(
        deliveryManId,
        { $inc: { totalOrders: 1 } }
      );
    }

    order.deliveryManId = deliveryManId;
    await order.save();

    res.status(200).json({ message: "Delivery Man assigned successfully!", order });
  } catch (error) {
    res.status(500).json({ message: "Error assigning delivery man", error: error.message });
  }
};

