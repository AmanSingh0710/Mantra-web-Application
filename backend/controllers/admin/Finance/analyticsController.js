// controllers/admin/Finance/analyticsController.js

const Order = require("../../../models/Order");
const User = require("../../../models/User/User");
const Vendor = require("../../../models/Vendor/Store");
const Product = require("../../../models/Product/Product");
const Commission = require("../../../models/Finance/Commission");
const VendorOrder = require("../../../models/Finance/VendorOrder");
const Store = require("../../../models/Vendor/Store");


// ====================================================
// DASHBOARD SUMMARY
// ====================================================


// Dashboard analytics
exports.getDashboardAnalytics = async (req, res) => {
  try {

    const [
      totalOrders,
      totalCustomers,
      totalProducts,
      totalVendors
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Product.countDocuments(),
      Vendor.countDocuments()
    ]);


    const salesData = await Order.aggregate([
      {
        $match: {
          "payment.status": "Paid"
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$pricing.grandTotal" }
        }
      }
    ]);


    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);


    const statusMap = {};

    orderStatusStats.forEach(item => {
      statusMap[item._id] = item.count;
    });


    res.status(200).json({
      success: true,
      analytics: {
        totalSales: salesData[0]?.totalSales || 0,
        totalOrders,
        totalCustomers,
        totalProducts,
        totalVendors,

        pendingOrders: statusMap["Pending"] || 0,
        confirmedOrders: statusMap["Confirmed"] || 0,
        processingOrders: statusMap["Processing"] || 0,
        packedOrders: statusMap["Packed"] || 0,
        shippedOrders: statusMap["Shipped"] || 0,
        deliveredOrders: statusMap["Delivered"] || 0,
        cancelledOrders: statusMap["Cancelled"] || 0
      }
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//get monthely sales anlytics
exports.getMonthlySalesAnalytics = async (req, res) => {
  try {

    const sales = await Order.aggregate([
      {
        $match: { "payment.status": "Paid" }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: {
            $sum: "$pricing.grandTotal"
          },
          orders: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      sales
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

//get top selling produts
exports.getTopSellingProducts = async (req, res) => {
  try {

    const products = await Product
      .find({
        isDeleted: false
      })
      .sort({
        soldCount: -1
      })
      .limit(10)
      .select(
        "productName soldCount totalSales averageRating thumbnail"
      );

    res.status(200).json({
      success: true,
      products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

//get top Vendor
exports.getTopVendors = async (req, res) => {

  try {

    const vendors = await VendorOrder.aggregate([

      {
        $match: {
          status: {
            $ne: "Cancelled"
          }
        }
      },

      {
        $group: {
          _id: "$vendorId",

          totalRevenue: {
            $sum: "$grandTotal"
          },

          totalOrders: {
            $sum: 1
          }
        }
      },

      {
        $sort: {
          totalRevenue: -1
        }
      },

      {
        $limit: 10
      },

      {
        $lookup: {
          from: "stores",
          localField: "_id",
          foreignField: "_id",
          as: "vendor"
        }
      },

      {
        $unwind: "$vendor"
      },

      {
        $project: {
          _id: 1,
          totalRevenue: 1,
          totalOrders: 1,

          storeName:
            "$vendor.storeName",

          logo:
            "$vendor.logo"
        }
      }

    ]);

    return res.status(200).json({
      success: true,
      data: vendors
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.getCommissionSummary = async (req, res) => {
  try {

    const result = await Commission.aggregate([
      {
        $group: {
          _id: null,
          totalCommission: {
            $sum: "$commissionAmount"
          },
          totalOrders: {
            $sum: 1
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: result[0] || {
        totalCommission: 0,
        totalOrders: 0
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.getMonthlyCommissionAnalytics = async (req, res) => {
  try {

    const data = await Commission.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt"
            },
            month: {
              $month: "$createdAt"
            }
          },
          totalCommission: {
            $sum: "$commissionAmount"
          }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.getTopCommissionVendors = async (req, res) => {
  try {

    const data = await Commission.aggregate([
      {
        $group: {
          _id: "$vendorId",
          totalCommission: {
            $sum: "$commissionAmount"
          }
        }
      },
      {
        $sort: {
          totalCommission: -1
        }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: "stores",
          localField: "_id",
          foreignField: "_id",
          as: "vendor"
        },

      },
      {
        $unwind: "$vendor"
      },
      {
        $project: {
          totalCommission: 1,
          storeName: "$vendor.storeName",
          logo: "$vendor.logo"
        }
      }

    ]);

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.getTodayCommission = async (req, res) => {
  try {

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const result = await Commission.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end
          }
        }
      },
      {
        $group: {
          _id: null,
          todayCommission: {
            $sum: "$commissionAmount"
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      todayCommission:
        result[0]?.todayCommission || 0
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

//Get vendor revenue
exports.getVendorRevenueAnalytics = async (req, res) => {

  try {

    const data =
      await VendorOrder.aggregate([

        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt"
              },
              month: {
                $month: "$createdAt"
              }
            },

            revenue: {
              $sum: "$grandTotal"
            }
          }
        },

        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1
          }
        }

      ]);

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


//get settlement summry
exports.getSettlementSummary = async (req, res) => {

  try {

    const pending =
      await VendorOrder.aggregate([

        {
          $match: {
            settlementStatus: "Pending"
          }
        },

        {
          $group: {
            _id: null,

            pendingAmount: {
              $sum: "$grandTotal"
            }
          }
        }

      ]);

    const released =
      await VendorOrder.aggregate([

        {
          $match: {
            settlementStatus: "Released"
          }
        },

        {
          $group: {
            _id: null,

            releasedAmount: {
              $sum: "$grandTotal"
            }
          }
        }

      ]);

    res.status(200).json({

      success: true,

      pendingSettlement:
        pending[0]?.pendingAmount || 0,

      releasedSettlement:
        released[0]?.releasedAmount || 0

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


//vendor status analytcis
exports.getVendorOrderStatusAnalytics = async (req, res) => {

  try {

    const result =
      await VendorOrder.aggregate([

        {
          $group: {
            _id: "$status",

            count: {
              $sum: 1
            }
          }
        }

      ]);

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};