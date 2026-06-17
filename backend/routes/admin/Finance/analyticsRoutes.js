// routes/admin/Finance/analyticsRoutes.js
const express = require("express");
const auth = require("../../../middleware/auth");
const isAdmin = require("../../../middleware/isAdmin");
const authLimiter = require("../../../middleware/authLimiter");
const analyticsController = require("../../../controllers/admin/Finance/analyticsController");

const router = express.Router();

// ======================================================
// DASHBOARD ANALYTICS
// ======================================================
router.get("/dashboard", authLimiter, auth, isAdmin("ADMIN"), analyticsController.getDashboardAnalytics);

// ======================================================
// SALES ANALYTICS
// ======================================================
router.get("/monthly-sales", authLimiter, auth, isAdmin("ADMIN"), analyticsController.getMonthlySalesAnalytics);

// ======================================================
// PRODUCT ANALYTICS
// ======================================================
router.get("/top-products", authLimiter, auth, isAdmin("ADMIN"), analyticsController.getTopSellingProducts);

// ======================================================
// VENDOR ANALYTICS
// ======================================================
router.get("/top-vendors", authLimiter, auth, isAdmin("ADMIN"), analyticsController.getTopVendors);

// ======================================================
// COMMISSION ANALYTICS
// ======================================================
router.get("/commission-summary", authLimiter, auth, isAdmin("ADMIN"), analyticsController.getCommissionSummary);
router.get("/monthly-commission", authLimiter, auth, isAdmin("ADMIN"), analyticsController.getMonthlyCommissionAnalytics);
router.get("/top-commission-vendors", authLimiter, auth, isAdmin("ADMIN"), analyticsController.getTopCommissionVendors);
router.get("/today-commission", authLimiter, auth, isAdmin("ADMIN"), analyticsController.getTodayCommission);

module.exports = router;