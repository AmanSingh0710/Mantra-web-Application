require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const sanitize = require("./middleware/sanitize");
const xssSanitize = require("./middleware/xssSanitize");
const globalLimiter = require("./middleware/globalLimiter");

const app = express();

app.set("trust proxy", 1);

/* ==========================================
   1. GLOBAL HIGH-PERFORMANCE MIDDLEWARES (Non-Rate Limited)
   ========================================== */

// Standard CORS policy mechanism configuration
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// Apply HTTP security headers variant globally
app.use(helmet());

// 🛡️ PRODUCTION FIX: Serve static assets BEFORE rate limiter 
// Takii imagery asset pipelines consumer limit records count me catch na hon
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Logging pipeline configuration tracking
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined")); // Comprehensive logging context for production
}

/* ==========================================
   2. SECURITY & DATA PARSING PIPELINES
   ========================================== */

// Apply rate limits universally across backend operational controllers
app.use(globalLimiter);

// Payload control & sanitation core layers
app.use(express.json({ limit: "10kb" })); // Prevents massive payload floods (DoS mitigation)
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// NoSQL injection and Cross-Site Scripting (XSS) input filtering engines
app.use(sanitize);
app.use(xssSanitize);

/* ==========================================
   3. CORE APP ROUTING REGISTRY
   ========================================== */

// Base API health validation route checkpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    environment: process.env.NODE_ENV || "development",
    message: "Mantra Backend Running"
  });
});

// --- User Domain Space API Endpoints ---
app.use("/cart", require("./routes/user/cartRoutes"));
app.use("/faq", require("./routes/user/faqRoutes"));
app.use("/review", require("./routes/user/reviewRoutes"));
app.use("/otp", require("./routes/user/otpRoutes"));

// --- Vendor Management Controllers Domain ---
app.use("/vendor-store", require("./routes/Vendor/vendorStoreRoutes"));
app.use("/deliveryBoy", require("./routes/deliveryBoy/deliveryBoyRoutes"));

// --- Admin Control Dashboard Operations Subsystems ---
app.use("/auth", require("./routes/admin/authRoutes"));
app.use("/visitor", require("./routes/admin/visitorRoutes"));
app.use("/Adminproducts", require("./routes/admin/AdminproductRoutes"));
app.use("/order", require("./routes/admin/orderRoutes"));
app.use("/stores", require("./routes/admin/storeRoutes"));
app.use("/dashboard", require("./routes/admin/dashboardRoutes"));
app.use("/offers", require("./routes/admin/offerRoutes"));
app.use("/brand", require("./routes/admin/brandRoutes"));
app.use("/categories", require("./routes/admin/categoryRoutes"));
app.use("/banner", require("./routes/admin/bannerRoutes"));
app.use("/attributes", require("./routes/admin/attributeRoutes"));
app.use("/notifications", require("./routes/admin/notificationRoutes"));
app.use("/salesReport", require("./routes/admin/salesRoutes"));
app.use("/report", require("./routes/admin/orderReportRoutes"));
app.use("/deliveryman", require("./routes/admin/deliveryManRoutes"));
app.use("/blogs", require("./routes/admin/blogRoutes"));
app.use("/employees", require("./routes/admin/employeeRoutes"));
app.use("/support", require("./routes/admin/Help&Support/supportRoutes"));
app.use("/hero", require("./routes/admin/heroRoutes"));
app.use("/subscribers", require("./routes/admin/subscriberRoutes"));
app.use("/stories", require("./routes/admin/storyRoutes"));

/* ==========================================
   4. GLOBAL FALLBACK ERROR CATCHERS
   ========================================== */

// Catch-all unhandled route management (404 Error handler)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Requested Cloud Path Routing Resource [${req.originalUrl}] Does Not Exist.`
  });
});

// Final error boundary interceptor pipeline
app.use((err, req, res, next) => {
  console.error("Critical Cloud Operation Interception Failure:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Execution Interrupted."
  });
});

module.exports = app;