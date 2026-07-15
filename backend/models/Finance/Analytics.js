// models/Finance/Analytics.js

const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
            unique: true
        },

        // SALES
        totalSales: {
            type: Number,
            default: 0
        },

        grossSales: {
            type: Number,
            default: 0
        },

        netSales: {
            type: Number,
            default: 0
        },

        totalProfit: {
            type: Number,
            default: 0
        },

        totalCommission: {
            type: Number,
            default: 0
        },

        todayCommission: {
            type: Number,
            default: 0
        },

        monthlyCommission: {
            type: Number,
            default: 0
        },

        yearlyCommission: {
            type: Number,
            default: 0
        },

    // ORDERS

    totalOrders: {
            type: Number,
            default: 0
        },

        completedOrders: {
            type: Number,
            default: 0
        },

        pendingOrders: {
            type: Number,
            default: 0
        },

        processingOrders: {
            type: Number,
            default: 0
        },

        shippedOrders: {
            type: Number,
            default: 0
        },

        deliveredOrders: {
            type: Number,
            default: 0
        },

        cancelledOrders: {
            type: Number,
            default: 0
        },

        refundedOrders: {
            type: Number,
            default: 0
        },

        // CUSTOMERS

        totalCustomers: {
            type: Number,
            default: 0
        },

        newCustomers: {
            type: Number,
            default: 0
        },

        repeatCustomers: {
            type: Number,
            default: 0
        },

        activeCustomers: {
            type: Number,
            default: 0
        },

        // VENDORS

        totalVendors: {
            type: Number,
            default: 0
        },

        activeVendors: {
            type: Number,
            default: 0
        },

        inactiveVendors: {
            type: Number,
            default: 0
        },

        // PRODUCTS

        totalProducts: {
            type: Number,
            default: 0
        },

        activeProducts: {
            type: Number,
            default: 0
        },

        outOfStockProducts: {
            type: Number,
            default: 0
        },

        // REFUND

        totalRefundAmount: {
            type: Number,
            default: 0
        },

        // DELIVERY

        totalDeliveries: {
            type: Number,
            default: 0
        },

        successfulDeliveries: {
            type: Number,
            default: 0
        },

        failedDeliveries: {
            type: Number,
            default: 0
        },

        // WALLET

        totalWalletTransactions: {
            type: Number,
            default: 0
        },

        totalWalletBalance: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model("Analytics", analyticsSchema);