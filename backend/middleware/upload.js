const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary Credentials Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Production Storage Engine Engine (Amazon/Flipkart Style)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Mantra-Ecommerce-Assets", // Cloudinary par auto-create hone waale folder ka naam
    allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4", "mov"],
    resource_type: "auto", // Automatically detects if upload is image or video asset
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB global size bracket for high-res clips
  },
});

module.exports = upload;