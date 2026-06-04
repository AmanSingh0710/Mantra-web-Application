const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");


// GET SALES REPORT
exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Total Orders
    const totalOrders = await Order.countDocuments(filter);

    // Total Revenue
    const revenueData = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Total Products Sold
    const productSoldData = await Order.aggregate([
      { $match: filter },
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          totalProductsSold: { $sum: "$items.quantity" },
        },
      },
    ]);

    const totalProductsSold =
      productSoldData.length > 0
        ? productSoldData[0].totalProductsSold
        : 0;

    // Monthly Revenue Chart
    const monthlySales = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    // Top Selling Products
    const topProducts = await Order.aggregate([
      { $match: filter },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      totalOrders,
      totalRevenue,
      totalProductsSold,
      monthlySales,
      topProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= EXPORT SALES (EXCEL) =================
exports.exportSalesReport = async (req, res) => {
  try {
    const orders = await Order.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales Report");

    worksheet.columns = [
      { header: "Order ID", key: "_id", width: 30 },
      { header: "Total Amount", key: "totalAmount", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Date", key: "createdAt", width: 25 },
    ];

    orders.forEach((order) => {
      worksheet.addRow(order);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sales-report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PDF Dowloader
exports.downloadSalesPDF = async (req, res) => {
  try {
    const orders = await Order.find();

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sales-report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(20).text("Sales Report", { align: "center" });
    doc.moveDown();

    orders.forEach((order, index) => {
      doc
        .fontSize(12)
        .text(
          `${index + 1}. Order ID: ${order._id} | Amount: ₹${order.totalAmount} | Status: ${order.status}`
        );
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

