const PDFDocument = require("pdfkit");
const Order = require("../../../models/Order");

// ======================================================
// GENERATE ORDER INVOICE
// ======================================================
exports.generateInvoice = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("userId", "name email phone");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const doc = new PDFDocument({
            size: "A4",
            margin: 50
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=invoice-${order.orderNumber}.pdf`);

        doc.pipe(res);

        // HEADER
        doc.fontSize(22).text("Mantar Invoice", { align: "center" });
        doc.moveDown();

        doc.fontSize(12).text(`Invoice Number: INV-${order.orderNumber}`);
        doc.text(`Order Number: ${order.orderNumber}`);
        doc.text(`Date: ${order.createdAt.toDateString()}`);
        doc.moveDown();

        // CUSTOMER
        doc.fontSize(15).text("Customer Details");
        doc.fontSize(12).text(`Name: ${order.shipping.name}`);
        doc.text(`Address: ${order.shipping.address}`);
        doc.moveDown();

        // PRODUCTS
        doc.fontSize(15).text("Products");
        order.products.forEach((item, index) => {
            doc.fontSize(12).text(`${index + 1}. ${item.name}`);
            doc.text(`Qty: ${item.quantity}   Price: ₹${item.price}`);
        });
        doc.moveDown();

        // TOTAL
        doc.fontSize(15).text("Payment Summary");
        doc.fontSize(12).text(`Subtotal: ₹${order.pricing.subTotal}`);
        doc.text(`Discount: ₹${order.pricing.discount}`);
        doc.text(`Tax: ₹${order.pricing.tax}`);
        doc.text(`Total: ₹${order.pricing.grandTotal}`);

        doc.end();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};