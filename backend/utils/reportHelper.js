// utils/reportHelper.js

const mongoose = require("mongoose");

exports.getPagination = (query) => {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.max(parseInt(query.limit) || 10, 1);
    return { page, limit, skip: (page - 1) * limit };
};

exports.buildFilter = (query, { searchFields = [], statusField = "status" , extraFilters = {}} = {}) => ({
    ...exports.buildDateFilter(query),
    ...exports.buildSearchFilter(query.search, searchFields),
     ...(query.status ? { [statusField]: query.status } : {}),
    ...(query.category ? { [categoryField]: query.category } : {}),
     ...extraFilters
});

exports.buildDateFilter = (query) => {
    const { startDate, endDate } = query;
    if (!startDate && !endDate) return {};
    const filter = { createdAt: {} };
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) { const date = new Date(endDate); date.setHours(23, 59, 59, 999); filter.createdAt.$lte = date; }
    return filter;
};

exports.buildSearchFilter = (search, fields = []) => {
    if (!search) return {};
    return { $or: fields.map((field) => ({ [field]: { $regex: search, $options: "i" } })) };
};

exports.buildSort = (sortBy = "createdAt", order = "desc") => ({ [sortBy]: order === "asc" ? 1 : -1 });

exports.buildStatusFilter = (status) => status ? { status } : {};

exports.objectIdFilter = (field, value) => {
    if (!value || !mongoose.Types.ObjectId.isValid(value)) return {};
    return { [field]: new mongoose.Types.ObjectId(value) };
};

exports.buildPriceFilter = (minPrice, maxPrice) => {
    if (!minPrice && !maxPrice) return {};
    const filter = {};
    if (minPrice) filter.$gte = Number(minPrice);
    if (maxPrice) filter.$lte = Number(maxPrice);
    return { totalAmount: filter };
};

exports.successResponse = (res, message, data = {}) => res.status(200).json({ success: true, message, data });

exports.errorResponse = (res, error, status = 500) => res.status(status).json({ success: false, message: error.message || "Something went wrong" });

exports.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

exports.formatCurrency = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount || 0);

exports.calculateGrowth = (current, previous) => {
    if (!previous && current) return 100;
    if (!previous) return 0;
    return Number((((current - previous) / previous) * 100).toFixed(2));
};

exports.generateFileName = (prefix) => `${prefix}-${new Date().toISOString().split("T")[0]}`;