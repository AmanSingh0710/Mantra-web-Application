const mongoose = require("mongoose");
const Order = require("../../models/Order");
const User = require("../../models/User");
const Store = require("../../models/Store");
const Product = require("../../models/Product");
const DeliveryMan = require("../../models/Deliveryman/DeliveryMan");

exports.getDashboard = async (req, res) => {
  try {

    // 🔐 EXTRA SECURITY
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { period = "monthly", from, to } = req.query;

    /* =========================
       🔹 DATE FILTER
    ========================== */
    let dateFilter = {};

    if (from && to) {
      dateFilter.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    } else {
      const now = new Date();

      if (period === "weekly") {
        const firstDay = new Date();
        firstDay.setDate(now.getDate() - 7);
        dateFilter.createdAt = { $gte: firstDay };
      }

      if (period === "monthly") {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFilter.createdAt = { $gte: firstDay };
      }

      if (period === "yearly") {
        const firstDay = new Date(now.getFullYear(), 0, 1);
        dateFilter.createdAt = { $gte: firstDay };
      }
    }

    /* =========================
       1️⃣ TOTAL COUNTS
    ========================== */
    const [
      totalOrders,
      totalStores,
      totalProducts,
      totalCustomers,
      totalDeliveryMan,
      totalVendors
    ] = await Promise.all([
      Order.countDocuments(dateFilter),
      Store.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: "USER" }),
      DeliveryMan.countDocuments(),
      User.countDocuments({ role: "VENDOR" })
    ]);

    /* =========================
       2️⃣ ORDER STATUS
    ========================== */
    const orderStatusAgg = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const orderStatus = {
      all: totalOrders,
      pending: 0,
      confirmed: 0,
      packaging: 0,
      outForDelivery: 0,
      delivered: 0,
      returned: 0,
      failed: 0,
      canceled: 0,
    };

    orderStatusAgg.forEach((item) => {
      const status = item._id?.toLowerCase();

      if (["placed", "pending"].includes(status))
        orderStatus.pending += item.count;
      else if (status === "confirmed")
        orderStatus.confirmed += item.count;
      else if (["packaging", "packing"].includes(status))
        orderStatus.packaging += item.count;
      else if (["out_for_delivery", "out for delivery"].includes(status))
        orderStatus.outForDelivery += item.count;
      else if (status === "delivered")
        orderStatus.delivered += item.count;
      else if (["cancelled", "canceled"].includes(status))
        orderStatus.canceled += item.count;
      else if (status === "returned")
        orderStatus.returned += item.count;
      else if (status === "failed")
        orderStatus.failed += item.count;
    });


    /* =========================
       3️⃣ WALLET
    ========================== */
    const earningsAgg = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalCommission: { $sum: "$adminCommission" },
          totalDeliveryCharge: { $sum: "$deliveryCharge" },
          totalTax: { $sum: "$tax" },
        },
      },
    ]);

    const walletData = earningsAgg[0] || {
      totalRevenue: 0,
      totalCommission: 0,
      totalDeliveryCharge: 0,
      totalTax: 0,
    };

    const netInhouse =
      walletData.totalRevenue - walletData.totalCommission;

    /* =========================
       4️⃣ TOP CUSTOMERS
    ========================== */
    const topCustomers = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$userId",
          orderCount: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          name: "$user.name",
          image: "$user.image",
          orderCount: 1
        }
      }
    ]);

    /* =========================
       5️⃣ TOP DELIVERY MEN
    ========================== */
    const topDeliveryMen = await Order.aggregate([
      {
        $match: {
          ...dateFilter,
          status: { $regex: /^delivered$/i },
          deliveryManId: { $ne: null }
        }
      },
      {
        $group: {
          _id: "$deliveryManId",
          orders: { $sum: 1 }
        }
      },
      { $sort: { orders: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "deliverymen",
          localField: "_id",
          foreignField: "_id",
          as: "m"
        }
      },
      { $unwind: "$m" },
      {
        $project: {
          name: { $concat: ["$m.firstName", " ", "$m.lastName"] },
          image: "$m.deliveryman_image",
          orders: 1
        }
      }
    ]);


    /* =========================
   6️⃣ ORDER CHART
========================= */
    const orderStats = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const inhouseData = new Array(12).fill(0);

    orderStats.forEach(item => {
      inhouseData[item._id - 1] = item.total;
    });

    /* =========================
   7️⃣ EARNING CHART
========================= */
    const earningStats = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalAmount" },
          commission: { $sum: "$adminCommission" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const earningLabels = labels;
    const inhouseEarningData = new Array(12).fill(0);
    const commissionData = new Array(12).fill(0);

    earningStats.forEach(item => {
      inhouseEarningData[item._id - 1] = item.revenue - item.commission;
      commissionData[item._id - 1] = item.commission;
    });

    /* =========================
       🚀 RESPONSE
    ========================== */
    res.status(200).json({
      totalStores,
      totalProducts,
      totalCustomers,
      totalOrders,


      vendors: totalVendors,
      delivery: totalDeliveryMan,
      customers: totalCustomers,

      orderStatus,

      // ✅ ORDER CHART
      labels,
      inhouseData,
      vendorData: [],

      // ✅ EARNING CHART
      earningLabels,
      inhouseEarningData,
      vendorEarningData: [],
      commissionData,

      wallet: {
        inHouseEarning: netInhouse,
        commissionEarned: walletData.totalCommission,
        deliveryCharge: walletData.totalDeliveryCharge,
        taxCollected: walletData.totalTax,
      },

      topCustomers,
      topDeliveryMen
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Dashboard error" });
  }
};