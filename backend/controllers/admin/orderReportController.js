const Order = require("../../models/Order");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");


// ================= GET ORDER REPORT =================
exports.getOrderReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    res.json({
      totalOrders,
      totalRevenue,
      orders,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= EXPORT EXCEL =================
exports.exportOrderExcel = async (req, res) => {
  try {
    const orders = await Order.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Order Report");

    worksheet.columns = [
      { header: "Order ID", key: "_id", width: 30 },
      { header: "Amount", key: "totalAmount", width: 20 },
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
      "attachment; filename=order-report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= DOWNLOAD PDF =================
exports.downloadOrderPDF = async (req, res) => {
  try {
    const orders = await Order.find();

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=order-report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(20).text("Order Report", { align: "center" });
    doc.moveDown();

    orders.forEach((order, index) => {
      doc
        .fontSize(12)
        .text(
          `${index + 1}. ID: ${order._id} | ₹${order.totalAmount} | ${order.status}`
        );
    });

    doc.end();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
