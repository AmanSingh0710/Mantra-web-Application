// controllers/admin/deliveryBoyController.js

const DeliveryBoy = require("../../../models/Deliveryman/DeliveryMan");
const Order = require("../../../models/Order");

const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// ================= DELETE FILE =================
const deleteFile = (filename) => {
  try {

    if (!filename) return;

    const filePath = path.join(
      __dirname,
      "../../uploads",
      filename
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

  } catch (error) {
    console.log(error.message);
  }
};

// ======================================================
// ADMIN ADD DELIVERY BOY
// ======================================================
exports.addDeliveryBoy = async (req, res) => {
  try {

    const {
      name,
      email,
      mobile,
      password,
      vehicleType,
      vehicleNumber,
      licenseNumber,
      aadhaarNumber,
      address,
      city,
      state,
      pincode,
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      upiId,
    } = req.body;

    // ================= EMAIL CHECK =================
    const existing =
      await DeliveryBoy.findOne({
        email,
      });

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "Delivery boy already exists",
      });
    }

    // ================= HASH PASSWORD =================
    const hashedPassword =
      await bcrypt.hash(password, 12);

    // ================= FILES =================
    const image =
      req.files?.image?.[0]?.filename || "";

    const aadhaarFront =
      req.files?.aadhaarFront?.[0]
        ?.filename || "";

    const aadhaarBack =
      req.files?.aadhaarBack?.[0]
        ?.filename || "";

    const drivingLicenseImage =
      req.files?.drivingLicenseImage?.[0]
        ?.filename || "";

    const vehicleImage =
      req.files?.vehicleImage?.[0]
        ?.filename || "";

    // ================= CREATE =================
    const deliveryBoy =
      await DeliveryBoy.create({
        name,
        email,
        mobile,
        password: hashedPassword,
        vehicleType,
        vehicleNumber,
        licenseNumber,
        aadhaarNumber,
        address,
        city,
        state,
        pincode,
        bankName,
        accountHolderName,
        accountNumber,
        ifscCode,
        upiId,

        image,
        aadhaarFront,
        aadhaarBack,
        drivingLicenseImage,
        vehicleImage,
      });

    res.status(201).json({
      success: true,
      message:
        "Delivery boy created successfully",
      deliveryBoy,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// GET ALL DELIVERY BOYS
// ======================================================
exports.getAllDeliveryBoys =
async (req, res) => {
  try {

    const deliveryBoys =
      await DeliveryBoy.find()
        .sort({ createdAt: -1 });

    res.status(200).json(
      deliveryBoys
    );

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// GET SINGLE DELIVERY BOY
// ======================================================
exports.getSingleDeliveryBoy =
async (req, res) => {
  try {

    const deliveryBoy =
      await DeliveryBoy.findById(
        req.params.id
      );

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message:
          "Delivery boy not found",
      });
    }

    res.status(200).json(
      deliveryBoy
    );

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// UPDATE DELIVERY BOY
// ======================================================
exports.updateDeliveryBoy =
async (req, res) => {
  try {

    const deliveryBoy =
      await DeliveryBoy.findById(
        req.params.id
      );

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message:
          "Delivery boy not found",
      });
    }

    const updateData = {
      ...req.body,
    };

    // ================= IMAGE =================
    if (req.files?.image) {

      deleteFile(
        deliveryBoy.image
      );

      updateData.image =
        req.files.image[0].filename;
    }

    // ================= AADHAAR FRONT =================
    if (req.files?.aadhaarFront) {

      deleteFile(
        deliveryBoy.aadhaarFront
      );

      updateData.aadhaarFront =
        req.files.aadhaarFront[0]
          .filename;
    }

    // ================= AADHAAR BACK =================
    if (req.files?.aadhaarBack) {

      deleteFile(
        deliveryBoy.aadhaarBack
      );

      updateData.aadhaarBack =
        req.files.aadhaarBack[0]
          .filename;
    }

    // ================= LICENSE IMAGE =================
    if (
      req.files?.drivingLicenseImage
    ) {

      deleteFile(
        deliveryBoy.drivingLicenseImage
      );

      updateData.drivingLicenseImage =
        req.files
          .drivingLicenseImage[0]
          .filename;
    }

    // ================= VEHICLE IMAGE =================
    if (req.files?.vehicleImage) {

      deleteFile(
        deliveryBoy.vehicleImage
      );

      updateData.vehicleImage =
        req.files.vehicleImage[0]
          .filename;
    }

    // ================= PASSWORD =================
    if (req.body.password) {

      updateData.password =
        await bcrypt.hash(
          req.body.password,
          12
        );
    }

    const updatedDeliveryBoy =
      await DeliveryBoy.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message:
        "Delivery boy updated successfully",
      deliveryBoy:
        updatedDeliveryBoy,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// DELETE DELIVERY BOY
// ======================================================
exports.deleteDeliveryBoy =
async (req, res) => {
  try {

    const deliveryBoy =
      await DeliveryBoy.findById(
        req.params.id
      );

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message:
          "Delivery boy not found",
      });
    }

    // ================= DELETE FILES =================
    deleteFile(deliveryBoy.image);

    deleteFile(
      deliveryBoy.aadhaarFront
    );

    deleteFile(
      deliveryBoy.aadhaarBack
    );

    deleteFile(
      deliveryBoy.drivingLicenseImage
    );

    deleteFile(
      deliveryBoy.vehicleImage
    );

    await DeliveryBoy.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Delivery boy deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// TOGGLE ONLINE / OFFLINE
// ======================================================
exports.toggleDeliveryStatus =
async (req, res) => {
  try {

    const { status } = req.body;

    const deliveryBoy =
      await DeliveryBoy.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

    res.status(200).json({
      success: true,
      message:
        "Status updated successfully",
      deliveryBoy,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// VERIFY DELIVERY BOY
// ======================================================
exports.verifyDeliveryBoy =
async (req, res) => {
  try {

    const deliveryBoy =
      await DeliveryBoy.findByIdAndUpdate(
        req.params.id,
        {
          isVerified: true,
        },
        {
          new: true,
        }
      );

    res.status(200).json({
      success: true,
      message:
        "Delivery boy verified successfully",
      deliveryBoy,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// BLOCK / UNBLOCK
// ======================================================
exports.blockDeliveryBoy =
async (req, res) => {
  try {

    const deliveryBoy =
      await DeliveryBoy.findById(
        req.params.id
      );

    deliveryBoy.isBlocked =
      !deliveryBoy.isBlocked;

    await deliveryBoy.save();

    res.status(200).json({
      success: true,
      message:
        deliveryBoy.isBlocked
          ? "Delivery boy blocked"
          : "Delivery boy unblocked",
      deliveryBoy,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// DELIVERY ANALYTICS
// ======================================================
exports.getDeliveryStats =
async (req, res) => {
  try {

    const totalDeliveryBoys =
      await DeliveryBoy.countDocuments();

    const onlineDeliveryBoys =
      await DeliveryBoy.countDocuments({
        status: "ONLINE",
      });

    const activeDeliveries =
      await Order.countDocuments({
        deliveryStatus:
          "OUT_FOR_DELIVERY",
      });

    const completedDeliveries =
      await Order.countDocuments({
        deliveryStatus:
          "DELIVERED",
      });

    res.status(200).json({
      totalDeliveryBoys,
      onlineDeliveryBoys,
      activeDeliveries,
      completedDeliveries,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};