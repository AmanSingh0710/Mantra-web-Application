const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (order, res) => {

  const doc = new PDFDocument({
    size: "A4",
    margin: 45,
    bufferPages: true
  });

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${order.orderNumber}.pdf`
  );

  doc.pipe(res);

  const logoPath = path.join(
    __dirname,
    "../../assets/logo.png"
  );

  // --------------------------
  // Helpers
  // --------------------------

  const hr = (y) => {

    doc
      .strokeColor("#d1d5db")
      .lineWidth(.7)
      .moveTo(45, y)
      .lineTo(550, y)
      .stroke();

  };

  const money = value =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  // --------------------------
  // Logo
  // --------------------------

  if (fs.existsSync(logoPath)) {

    doc.image(
      logoPath,
      45,
      35,
      {
        width: 70
      }
    );

  }

  // --------------------------
  // Company
  // --------------------------

  doc
    .fontSize(22)
    .fillColor("#111827")
    .text(
      "MANTAR E-COMMERCE",
      140,
      38
    );

  doc
    .fontSize(10)
    .fillColor("#6b7280")
    .text(
      "Lucknow, Uttar Pradesh",
      140
    );

  doc.text(
    "Email : support@mantar.com"
  );

  doc.text(
    "Phone : +91 9876543210"
  );

  doc.text(
    "Website : www.mantar.com"
  );

  // --------------------------
  // Invoice Title
  // --------------------------

  doc
    .fontSize(26)
    .fillColor("#111827")
    .text(
      "INVOICE",
      420,
      45
    );

  doc
    .fontSize(10)
    .fillColor("#6b7280")
    .text(
      `Invoice No : ${order.invoiceNumber || order.orderNumber}`,
      380
    );

  doc.text(
    `Order No : ${order.orderNumber}`,
    380
  );

  doc.text(
    `Date : ${new Date(order.createdAt).toLocaleDateString("en-IN")}`,
    380
  );

  hr(125);

  // --------------------------
  // Billing
  // --------------------------

  doc
    .fontSize(14)
    .fillColor("#111827")
    .text(
      "Billing Address",
      45,
      145
    );

  doc
    .fontSize(11)
    .fillColor("#374151")
    .moveDown(.5);

  doc.text(order.shipping.name);

  doc.text(order.shipping.email);

  doc.text(order.shipping.mobile);

  doc.text(order.shipping.address);

  doc.text(
    `${order.shipping.city}, ${order.shipping.state}`
  );

  doc.text(
    `${order.shipping.country} - ${order.shipping.pin}`
  );

  // --------------------------
  // Payment
  // --------------------------

  doc
    .fontSize(14)
    .fillColor("#111827")
    .text(
      "Payment",
      330,
      145
    );

  doc
    .fontSize(11)
    .fillColor("#374151")
    .moveDown(.5);

  doc.text(
    `Method : ${order.payment.method}`
  );

  doc.text(
    `Status : ${order.payment.status}`
  );

  if (order.payment.transactionId) {

    doc.text(
      `Transaction : ${order.payment.transactionId}`
    );

  }

  hr(260);

  // --------------------------
  // Product Table Header
  // --------------------------

  let tableTop = 280;

  doc
    .rect(45, tableTop, 510, 28)
    .fill("#111827");

  doc
    .fillColor("#ffffff")
    .fontSize(10);

  doc.text(
    "Product",
    55,
    tableTop + 9
  );

  doc.text(
    "Qty",
    300,
    tableTop + 9,
    {
      width: 40,
      align: "center"
    }
  );

  doc.text(
    "Price",
    365,
    tableTop + 9,
    {
      width: 70,
      align: "right"
    }
  );

  doc.text(
    "Total",
    470,
    tableTop + 9,
    {
      width: 70,
      align: "right"
    }
  );

  // =============================
  // PART-2 starts from here
  // =============================

};

module.exports = generateInvoice;