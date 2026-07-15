const Order = require("../../models/Order");
const Product = require("../../models/VendorProduct");
const Vendor = require("../../models/Store");
const ExcelJS = require("exceljs");
const { exportToExcel } = require("../../utils/Export/excelExport");
const { exportToPDF } = require("../../utils/Export/pdfExport");
const PDFDocument = require("pdfkit");
const { getPagination, buildDateFilter, buildSearchFilter, buildFilter, buildStatusFilter, buildSort, successResponse, errorResponse, generateFileName, formatCurrency } = require("../../utils/reportHelper");

//controllers/admin/orderReportController.js

exports.getOrderReport = async (req, res) => {
    try {
        const { search, status, sortBy, order } = req.query;
        const { page, limit, skip } = getPagination(req.query);
        const filter = buildFilter(req.query, {
            searchFields: ["orderNumber", "status"]
        });

        const [orders, totalOrders, summary] = await Promise.all([
            Order.find(filter).sort(buildSort(sortBy, order)).skip(skip).limit(limit).lean(),
            Order.countDocuments(filter),
            Order.aggregate([
                { $match: filter },
                {
                    $facet: {
                        revenue: [{ $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }],
                        statusCounts: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
                        today: [
                            { $match: { createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } } },
                            { $group: { _id: null, orders: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } }
                        ],
                        month: [
                            { $match: { createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } },
                            { $group: { _id: null, orders: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } }
                        ]
                    }
                }
            ])
        ]);

        const statusCountsMap = {};
        summary[0].statusCounts.forEach(item => { statusCountsMap[item._id] = item.count; });

        return successResponse(res, "Order report fetched successfully", {
            summary: {
                totalOrders,
                totalRevenue: summary[0].revenue[0]?.totalRevenue || 0,
                todayOrders: summary[0].today[0]?.orders || 0,
                todayRevenue: summary[0].today[0]?.revenue || 0,
                thisMonthOrders: summary[0].month[0]?.orders || 0,
                thisMonthRevenue: summary[0].month[0]?.revenue || 0,
                pendingOrders: statusCountsMap.Pending || 0,
                confirmedOrders: statusCountsMap.Confirmed || 0,
                processingOrders: statusCountsMap.Processing || 0,
                shippedOrders: statusCountsMap.Shipped || 0,
                outForDeliveryOrders: statusCountsMap["Out For Delivery"] || 0,
                deliveredOrders: statusCountsMap.Delivered || 0,
                cancelledOrders: statusCountsMap.Cancelled || 0
            },
            pagination: { page, limit, totalPages: Math.ceil(totalOrders / limit), totalRecords: totalOrders },
            orders
        });
    } catch (error) {
        return errorResponse(res, error);
    }
};

// EXPORT EXCEL
exports.exportOrderExcel = async (req, res) => {
    try {
        const filter = { ...buildDateFilter(req.query), ...buildStatusFilter(req.query.status) };
        const orders = await Order.find(filter)
            .select("_id orderNumber totalAmount paymentMethod paymentStatus status createdAt")
            .sort({ createdAt: -1 }).lean();


        const columns = [
            { header: "Order Number", key: "orderNumber", width: 25 },
            { header: "Amount", key: "totalAmount", width: 18 },
            { header: "Payment", key: "paymentMethod", width: 18 },
            { header: "Payment Status", key: "paymentStatus", width: 20 },
            { header: "Order Status", key: "status", width: 20 },
            { header: "Created At", key: "createdAt", width: 25 }
        ];

        const rows = orders.map(order => ({
            orderNumber: order.orderNumber || order._id,
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            status: order.status,
            createdAt: new Date(order.createdAt).toLocaleString()
        }));

        return exportToExcel({
            res,
            fileName: "order-report",
            sheetName: "Orders",
            columns,
            rows
        });

    } catch (error) {
        return errorResponse(res, error);
    }
};

// EXPORT PDF
exports.downloadOrderPDF = async (req, res) => {
    try {
        const filter = { ...buildDateFilter(req.query), ...buildStatusFilter(req.query.status) };
        const orders = await Order.find(filter)
            .select("_id orderNumber totalAmount paymentMethod paymentStatus status createdAt")
            .sort({ createdAt: -1 }).lean();

        const columns = [
            { header: "index", key: "orderNumber" },
            { header: "Amount", key: "totalAmount" },
            { header: "Payment", key: "paymentMethod" },
            { header: "Payment Status", key: "paymentStatus" },
            { header: "Status", key: "price" },
            { header: "Stock", key: "stock" },
            { header: "Status", key: "status" },
            { header: "Created", key: "createdAt" }
        ];

        const rows = orders.map(order => ({
            orderNumber: order.orderNumber || order._id,
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            status: order.status,
            createdAt: new Date(order.createdAt).toLocaleString()
        }));

        return exportToPDF({
            res,
            title: "Order Report",
            columns,
            rows
        });
    } catch (error) {
        return errorResponse(res, error);
    }
};

// PRODUCT REPORT
exports.getProductReport = async (req, res) => {
    try {
        const { search, status, sortBy = "createdAt", order = "desc" } = req.query;
        const { page, limit, skip } = getPagination(req.query);
        const filter = buildFilter(req.query, { searchFields: ["productName", "sku"],  statusField: "status", categoryField: "category" });
        
        const [products, totalProducts, summary] = await Promise.all([
            Product.find(filter).populate("category", "name").populate("store", "storeName").populate("brand", "name").sort(buildSort(sortBy, order)).skip(skip).limit(limit).lean(),
            Product.countDocuments(filter),
            Product.aggregate([
                { $match: filter },
                {
                    $facet: {
                        inventory: [{ $group: { _id: null, totalStock: { $sum: "$stock" }, inventoryValue: { $sum: { $multiply: ["$price", "$stock"] } } } }],
                        status: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
                        lowStock: [{ $match: { stock: { $gt: 0, $lte: 10 } } }, { $count: "count" }],
                        outOfStock: [{ $match: { stock: 0 } }, { $count: "count" }]
                    }
                }
            ])
        ]);
        const report = summary[0] || {};
        const statusMap = {};
        (report.status || []).forEach(item => statusMap[item._id] = item.count);
        return successResponse(res, "Product report fetched successfully", {
            summary: {
                totalProducts,
                activeProducts: statusMap.ACTIVE || 0,
                inactiveProducts: statusMap.INACTIVE || 0,
                draftProducts: statusMap.DRAFT || 0,
                lowStockProducts: report.lowStock?.[0]?.count || 0,
                outOfStockProducts: report.outOfStock?.[0]?.count || 0,
                totalStock: report.inventory?.[0]?.totalStock || 0,
                inventoryValue: report.inventory?.[0]?.inventoryValue || 0
            },
            pagination: { page, limit, totalPages: Math.ceil(totalProducts / limit), totalRecords: totalProducts },
            products
        });
    } catch (error) { return errorResponse(res, error); }
};

//Helper to fetch processed product items for reporting exports
const fetchExportProducts = async (query) => {
    const filter = {
        ...buildDateFilter(query),
        ...buildStatusFilter(query.status),
    };

    return Product.find(filter)
        .populate("category", "name")
        .populate("store", "storeName")
        .populate("brand", "name")
        .select("productName thumbnail brand price stock status category store createdAt")
        .sort({ createdAt: -1 })
        .lean();
};

exports.exportProductExcel = async (req, res) => {
    try {
        const products = await fetchExportProducts(req.query);
        const columns = [
            { header: "Image", key: "image", width: 40 },
            { header: "Product", key: "name", width: 35 },
            { header: "Brand", key: "brand", width: 20 },
            { header: "Category", key: "category", width: 22 },
            { header: "Store", key: "store", width: 25 },
            { header: "Price", key: "price", width: 15 },
            { header: "Stock", key: "stock", width: 15 },
            { header: "Status", key: "status", width: 18 },
            { header: "Created", key: "createdAt", width: 22 },
        ];

        const rows = products.map(product => ({
            image: product.thumbnail?.url || "",
            name: product.productName,
            brand: product.brand?.name || "-",
            category: product.category?.name || "-",
            store: product.store?.shopName || "-",
            price: product.price,
            stock: product.stock,
            status: product.status,
            createdAt: new Date(product.createdAt).toLocaleString()
        }));

        return exportToExcel({
            res,
            fileName: "product-report",
            sheetName: "Product Report",
            columns,
            rows
        });

    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.exportProductPDF = async (req, res) => {
    try {
        const products = await fetchExportProducts(req.query);

        const columns = [
            { header: "Product", key: "name" },
            { header: "Brand", key: "brand" },
            { header: "Category", key: "category" },
            { header: "Store", key: "store" },
            { header: "Price", key: "price" },
            { header: "Stock", key: "stock" },
            { header: "Status", key: "status" },
            { header: "Created", key: "createdAt" }
        ];

        const rows = products.map(product => ({
            name: product.productName,
            brand: product.brand?.name || "-",
            category: product.category?.name || "-",
            store: product.store?.shopName || "-",
            price: formatCurrency(product.price),
            stock: product.stock,
            status: product.status,
            createdAt: new Date(product.createdAt).toLocaleString()
        }));

        return exportToPDF({
            res,
            title: "Product Report",
            columns,
            rows
        });
    } catch (error) {
        return errorResponse(res, error);
    }
};

// INHOUSE SALES REPORT
exports.getInhouseSalesReport = async (req, res) => {
    try {
        const { search, sortBy = "createdAt", order = "desc" } = req.query;
        const { page, limit, skip } = getPagination(req.query);
        const filter = { ...buildDateFilter(req.query), ...buildSearchFilter(search, ["orderNumber"]), status: "Delivered" };
        const [orders, totalOrders, revenue, monthlySales] = await Promise.all([
            Order.find(filter).populate("customer", "name email").populate("products.product", "name thumbnail brand").sort(buildSort(sortBy, order)).skip(skip).limit(limit).lean(),
            Order.countDocuments(filter),
            Order.aggregate([{ $match: filter }, { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" }, totalItems: { $sum: { $size: "$products" } } } }]),
            Order.aggregate([{ $match: { status: "Delivered" } }, { $group: { _id: { month: { $month: "$createdAt" } }, revenue: { $sum: "$totalAmount" }, orders: { $sum: 1 } } }, { $sort: { "_id.month": 1 } }])
        ]);
        const totalRevenue = revenue[0]?.totalRevenue || 0;
        const totalItems = revenue[0]?.totalItems || 0;
        const averageOrderValue = totalOrders ? Number((totalRevenue / totalOrders).toFixed(2)) : 0;
        return successResponse(res, "Inhouse sales report fetched successfully", {
            summary: { totalOrders, totalRevenue, productsSold: totalItems, averageOrderValue },
            chart: monthlySales,
            pagination: { page, limit, totalPages: Math.ceil(totalOrders / limit), totalRecords: totalOrders },
            sales: orders
        });
    } catch (error) { return errorResponse(res, error); }
};

//  EXPORT INHOUSE SALES EXCEL
exports.exportInhouseSalesExcel = async (req, res) => {
    try {
        const filter = { ...buildDateFilter(req.query), status: "Delivered" };

        const orders = await Order.find(filter)
            .select("orderNumber shipping pricing payment products createdAt")
            .sort({ createdAt: -1 })
            .lean();

        const columns = [
            { header: "Order Number", key: "orderNumber", width: 25 },
            { header: "Customer Name", key: "customer", width: 30 },
            { header: "Email", key: "email", width: 35 },
            { header: "Products", key: "products", width: 15 },
            { header: "Amount", key: "amount", width: 18 },
            { header: "Payment Method", key: "paymentMethod", width: 18 },
            { header: "Payment Status", key: "paymentStatus", width: 18 },
            { header: "Order Date", key: "createdAt", width: 22 }
        ];

        const rows = orders.map(order => ({
            orderNumber: order.orderNumber,
            customer: order.shipping?.name || "-",
            email: order.shipping?.email || "-",
            products: order.products.length,
            amount: order.pricing?.grandTotal || 0,
            paymentMethod: order.payment?.method || "-",
            paymentStatus: order.payment?.status || "-",
            createdAt: new Date(order.createdAt).toLocaleString()
        }));

        return exportToExcel({
            res,
            fileName: "inhouse-sales-report",
            sheetName: "Inhouse Sales",
            columns,
            rows
        });

    } catch (error) {
        return errorResponse(res, error);
    }
};

// EXPORT INHOUSE SALES PDF
exports.exportInhouseSalesPDF = async (req, res) => {
    try {
        const filter = { ...buildDateFilter(req.query), status: "Delivered" };

        const orders = await Order.find(filter)
            .select("orderNumber shipping pricing payment products createdAt")
            .sort({ createdAt: -1 })
            .lean();

        const rows = orders.map((order, index) => [
            (index + 1).toString(),
            order.orderNumber,
            order.shipping?.name || "-",
            order.shipping?.email || "-",
            order.products.length.toString(),
            formatCurrency(order.pricing?.grandTotal || 0),
            order.payment?.method || "-",
            order.payment?.status || "-",
            new Date(order.createdAt).toLocaleDateString()
        ]);

        const columns = {
            title: `Report Generated: ${new Date().toLocaleString()}`,
            headers: [
                "#",
                "Order",
                "Customer",
                "Email",
                "Products",
                "Amount",
                "Payment",
                "Status",
                "Date"
            ],
            rows: rows
        };

        return exportToPDF({
            res,
            title: "Inhouse Sales Report",
            columns,
            rows
        });

    } catch (error) {
        return errorResponse(res, error);
    }
};

// TRANSACTION REPORT CONTROLLER
exports.getTransactionReport = async (req, res) => {
    try {
        const { search, paymentMethod, paymentStatus, sortBy = "createdAt", order = "desc" } = req.query;
        const { page, limit, skip } = getPagination(req.query);

        const filter = buildFilter(req.query, { searchFields: ["orderNumber", "paymentMethod", "paymentStatus"] });

        if (paymentMethod) filter.paymentMethod = paymentMethod;
        if (paymentStatus) filter.paymentStatus = paymentStatus;

        // Concurrent pipeline execution
        const [transactions, totalTransactions, aggregateResult] = await Promise.all([
            Order.find(filter)
                .populate("customer", "name email")
                .sort(buildSort(sortBy, order))
                .skip(skip)
                .limit(limit)
                .lean(),

            Order.countDocuments(filter),

            Order.aggregate([
                { $match: filter },
                {
                    $facet: {
                        revenue: [{ $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }],
                        paymentMethod: [{ $group: { _id: "$paymentMethod", count: { $sum: 1 } } }],
                        paymentStatus: [{ $group: { _id: "$paymentStatus", count: { $sum: 1 } } }],
                    },
                },
            ]),
        ]);

        const facetData = aggregateResult[0] || {};

        // Efficiently map aggregations to lookup dictionaries
        const paymentMethodMap = (facetData.paymentMethod || []).reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});
        const paymentStatusMap = (facetData.paymentStatus || []).reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});

        return successResponse(res, "Transaction report fetched successfully", {
            summary: {
                totalTransactions,
                totalRevenue: facetData.revenue?.[0]?.totalRevenue || 0,
                codTransactions: paymentMethodMap.COD || 0,
                onlineTransactions: paymentMethodMap.ONLINE || 0,
                paidTransactions: paymentStatusMap.Paid || 0,
                pendingTransactions: paymentStatusMap.Pending || 0,
                failedTransactions: paymentStatusMap.Failed || 0,
            },
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(totalTransactions / limit),
                totalRecords: totalTransactions,
            },
            transactions,
        });
    } catch (error) {
        return errorResponse(res, error);
    }
};

// HELPERS / SHARED UTILITIES
/**
 * Fetches and formats transactions based on request filters.
 * @param {Object} query - Express request query parameters
 * @returns {Promise<Array>} Resolves to a list of populated order objects
 */
const fetchTransactionData = async (query) => {
    const filter = { ...buildDateFilter(query) };

    if (query.paymentMethod) filter.paymentMethod = query.paymentMethod;
    if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;

    return await Order.find(filter)
        .populate("customer", "name email")
        .select("orderNumber totalAmount paymentMethod paymentStatus status createdAt customer")
        .sort({ createdAt: -1 })
        .lean();
};

// EXPORT TRANSACTION EXCEL
exports.exportTransactionExcel = async (req, res) => {
    try {
        const transactions = await fetchTransactionData(req.query);

        const columns = [
            { header: "Order ID", key: "orderNumber", width: 25 },
            { header: "Customer Name", key: "customer", width: 30 },
            { header: "Email Address", key: "email", width: 35 },
            { header: "Amount", key: "amount", width: 15 },
            { header: "Payment Method", key: "method", width: 18 },
            { header: "Payment Status", key: "paymentStatus", width: 18 },
            { header: "Order Status", key: "status", width: 18 },
            { header: "Transaction Date", key: "createdAt", width: 22 }
        ];

        const rows = transactions.map(item => ({
            orderNumber: item.orderNumber || item._id.toString(),
            customer: item.customer?.name || "-",
            email: item.customer?.email || "-",
            amount: item.totalAmount,
            method: item.paymentMethod || "-",
            paymentStatus: item.paymentStatus || "-",
            status: item.status || "-",
            createdAt: new Date(item.createdAt).toLocaleString()
        }));

        return exportToExcel({
            res,
            fileName: "transaction-report",
            sheetName: "Transaction Report",
            columns,
            rows
        });

    } catch (error) {
        return errorResponse(res, error);
    }
};

// EXPORT TRANSACTION PDF
exports.exportTransactionPDF = async (req, res) => {
    try {
        const transactions = await fetchTransactionData(req.query);

        const rows = transactions.map((item, index) => [
            (index + 1).toString(),
            item.orderNumber || item._id.toString(),
            item.customer?.name || "-",
            formatCurrency(item.totalAmount),
            item.paymentMethod || "-",
            item.paymentStatus || "-",
            item.status || "-",
            new Date(item.createdAt).toLocaleDateString()
        ]);

        // Construct a structured data table
        const columns = {
            title: `Generated on: ${new Date().toLocaleString()}`,
            headers: ["#", "Order ID", "Customer", "Amount", "Method", "Pay Status", "Order Status", "Date"],
            rows: rows,
        };

        return exportToPDF({
            res,
            title: "Transaction Report",
            columns,
            rows
        });


    } catch (error) {
        return errorResponse(res, error);
    }
};

// VENDOR SALES REPORT CONTROLLER
exports.getVendorSalesReport = async (req, res) => {
    try {
        const { search, status, sortBy = "createdAt", order = "desc" } = req.query;
        const { page, limit, skip } = getPagination(req.query);
        const filter = buildFilter(req.query, { searchFields: ["name", "email", "storeName"] });
        const [vendors, totalVendors, aggregateResult] = await Promise.all([
            Vendor.aggregate([
                { $match: filter },
                {
                    $lookup: {
                        from: "orders",
                        localField: "_id",
                        foreignField: "store",
                        as: "orders",
                    },
                },
                {
                    $addFields: {
                        totalOrders: { $size: "$orders" },
                        totalRevenue: { $sum: "$orders.totalAmount" },
                        averageSale: {
                            $cond: [
                                { $gt: [{ $size: "$orders" }, 0] },
                                { $divide: [{ $sum: "$orders.totalAmount" }, { $size: "$orders" }] },
                                0,
                            ],
                        },
                    },
                },
                { $sort: buildSort(sortBy, order) },
                { $skip: skip },
                { $limit: limit },
            ]),

            Vendor.countDocuments(filter),

            Vendor.aggregate([
                { $match: filter },
                {
                    $lookup: {
                        from: "orders",
                        localField: "_id",
                        foreignField: "store",
                        as: "orders",
                    },
                },
                {
                    $facet: {
                        revenue: [
                            {
                                $group: {
                                    _id: null,
                                    totalRevenue: { $sum: { $sum: "$orders.totalAmount" } },
                                    totalProducts: { $sum: "$totalProducts" },
                                },
                            },
                        ],
                        status: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
                    },
                },
            ]),
        ]);

        const facetData = aggregateResult[0] || {};
        const revenueMetrics = facetData.revenue?.[0] || {};

        // Transform aggregation array into a high-performance hash dictionary
        const statusMap = (facetData.status || []).reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});

        const totalRevenue = revenueMetrics.totalRevenue || 0;

        return successResponse(res, "Vendor sales report fetched successfully", {
            summary: {
                totalVendors,
                activeVendors: statusMap.Active || 0,
                inactiveVendors: statusMap.Inactive || 0,
                totalRevenue,
                totalProducts: revenueMetrics.totalProducts || 0,
                averageSale: totalVendors ? Math.round(totalRevenue / totalVendors) : 0,
            },
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(totalVendors / limit),
                totalRecords: totalVendors,
            },
            vendors,
        });
    } catch (error) {
        return errorResponse(res, error);
    }
};

// HELPERS / SHARED UTILITIES
/**
 * Aggregates vendor details with order metrics based on filters.
 * @param {Object} query - Express request query object
 * @returns {Promise<Array>} Aggregated vendor sales data
 */
const getVendorSalesData = async (query) => {
    const filter = {
        ...buildDateFilter(query),
        ...buildStatusFilter(query.status),
        ...buildSearchFilter(query.search, ["name", "email", "storeName"])
    };

    return await Vendor.aggregate([
        { $match: filter },
        {
            $lookup: {
                from: "orders",
                localField: "_id",
                foreignField: "store",
                as: "orders"
            }
        },
        {
            $addFields: {
                totalOrders: { $size: "$orders" },
                totalRevenue: { $sum: "$orders.totalAmount" },
                totalProducts: "$totalProducts"
            }
        },
        { $sort: { createdAt: -1 } }
    ]);
};

// EXPORT VENDOR SALES EXCEL
exports.exportVendorSalesExcel = async (req, res) => {
    try {
        const vendors = await getVendorSalesData(req.query);
        const columns = [
            { header: "Vendor Name", key: "name", width: 30 },
            { header: "Email Address", key: "email", width: 35 },
            { header: "Store Name", key: "store", width: 30 },
            { header: "Total Products", key: "products", width: 15 },
            { header: "Total Orders", key: "orders", width: 15 },
            { header: "Total Revenue", key: "revenue", width: 18 },
            { header: "Status", key: "status", width: 18 },
            { header: "Join Date", key: "createdAt", width: 22 }
        ];

        const rows = vendors.map(vendor => ({
            name: vendor.name || "-",
            email: vendor.email || "-",
            store: vendor.storeName || "-",
            products: vendor.totalProducts || 0,
            orders: vendor.totalOrders || 0,
            revenue: vendor.totalRevenue || 0,
            status: vendor.status || "-",
            createdAt: new Date(vendor.createdAt).toLocaleString()
        }));

        return exportToExcel({
            res,
            fileName: "vendor-sales-report",
            sheetName: "Vendor Sales",
            columns,
            rows
        });

    } catch (error) {
        return errorResponse(res, error);
    }
};

// EXPORT VENDOR SALES PDF
exports.exportVendorSalesPDF = async (req, res) => {
    try {
        const vendors = await getVendorSalesData(req.query);
        const rows = vendors.map((vendor, index) => [
            (index + 1).toString(),
            vendor.name || "-",
            vendor.storeName || "-",
            (vendor.totalProducts || 0).toString(),
            (vendor.totalOrders || 0).toString(),
            formatCurrency(vendor.totalRevenue || 0),
            vendor.status || "-",
            new Date(vendor.createdAt).toLocaleDateString()
        ]);

        // Construct structural rendering setup
        const columns = {
            title: `Report Generated: ${new Date().toLocaleString()}`,
            headers: ["#", "Vendor", "Store", "Products", "Orders", "Revenue", "Status", "Joined"],
            rows: rows
        };

        return exportToPDF({
            res,
            title: "Vendor Sales Report",
            columns,
            rows
        });


    } catch (error) {
        return errorResponse(res, error);
    }
};