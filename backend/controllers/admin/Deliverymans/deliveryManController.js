// controllers/admin/deliveryManController.js

const mongoose = require("mongoose");
const DeliveryBoy = require("../../../models/Deliveryman/DeliveryMan");
const Order = require("../../../models/Order");
const { cloudinary, deleteCloudinaryFile } = require("../../../middleware/cloudinary");
const bcrypt = require("bcryptjs");



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

    const existing = await DeliveryBoy.findOne({
      $or: [
        { email },
        { mobile }
      ]
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email or Mobile already exists"
      });
    }

    const deliveryBoy =
      await DeliveryBoy.create({

        name,
        email,
        mobile,

        // DON'T HASH HERE
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

        image: req.files?.image?.[0]
          ? {
            url: req.files.image[0].path,
            publicId: req.files.image[0].filename,
          }
          : undefined,

        aadhaarFront: req.files?.aadhaarFront?.[0]
          ? {
            url: req.files.aadhaarFront[0].path,
            publicId: req.files.aadhaarFront[0].filename,
          }
          : undefined,

        aadhaarBack: req.files?.aadhaarBack?.[0]
          ? {
            url: req.files.aadhaarBack[0].path,
            publicId: req.files.aadhaarBack[0].filename,
          }
          : undefined,

        drivingLicenseImage: req.files?.drivingLicenseImage?.[0]
          ? {
            url: req.files.drivingLicenseImage[0].path,
            publicId: req.files.drivingLicenseImage[0].filename,
          }
          : undefined,

        vehicleImage: req.files?.vehicleImage?.[0]
          ? {
            url: req.files.vehicleImage[0].path,
            publicId: req.files.vehicleImage[0].filename,
          }
          : undefined,
      });

    res.status(201).json({
      success: true,
      message: "Delivery Boy Created Successfully",
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
exports.getAllDeliveryBoys = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total =
      await DeliveryBoy.countDocuments();

    const deliveryBoys =
      await DeliveryBoy.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: deliveryBoys
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// ======================================================
// GET SINGLE DELIVERY BOY
// ======================================================
exports.getSingleDeliveryBoy = async (req, res) => {

  try {

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Id"
      });
    }

    const deliveryBoy =
      await DeliveryBoy.findById(
        req.params.id
      );

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "Delivery Boy Not Found"
      });
    }

    res.status(200).json({
      success: true,
      deliveryBoy
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// ======================================================
// UPDATE DELIVERY BOY
// ======================================================
exports.updateDeliveryBoy = async (req, res) => {
  try {

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password,12);
    }

    const deliveryBoy = await DeliveryBoy.findById(req.params.id);

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message:
          "Delivery boy not found",
      });
    }

    const updateData = { ...req.body, };

    if (req.files?.image?.[0]) {

      if (deliveryBoy.image?.publicId) {
        await cloudinary.uploader.destroy(
          deliveryBoy.image.publicId
        );
      }

      updateData.image = {
        url: req.files.image[0].path,
        publicId: req.files.image[0].filename,
      };
    }

    if (req.files?.aadhaarFront?.[0]) {

      if (deliveryBoy.aadhaarFront?.publicId) {
        await cloudinary.uploader.destroy(
          deliveryBoy.aadhaarFront.publicId
        );
      }

      updateData.aadhaarFront = {
        url: req.files.aadhaarFront[0].path,
        publicId: req.files.aadhaarFront[0].filename,
      };
    }

    if (req.files?.aadhaarBack?.[0]) {

      if (deliveryBoy.aadhaarBack?.publicId) {
        await cloudinary.uploader.destroy(
          deliveryBoy.aadhaarBack.publicId
        );
      }

      updateData.aadhaarBack = {
        url: req.files.aadhaarBack[0].path,
        publicId: req.files.aadhaarBack[0].filename,
      };
    }

    if (req.files?.drivingLicenseImage?.[0]) {

      if (deliveryBoy.drivingLicenseImage?.publicId) {
        await cloudinary.uploader.destroy(
          deliveryBoy.drivingLicenseImage.publicId
        );
      }

      updateData.drivingLicenseImage = {
        url: req.files.drivingLicenseImage[0].path,
        publicId: req.files.drivingLicenseImage[0].filename,
      };
    }

    if (req.files?.vehicleImage?.[0]) {

      if (deliveryBoy.vehicleImage?.publicId) {
        await cloudinary.uploader.destroy(
          deliveryBoy.vehicleImage.publicId
        );
      }

      updateData.vehicleImage = {
        url: req.files.vehicleImage[0].path,
        publicId: req.files.vehicleImage[0].filename,
      };
    }

    const updatedDeliveryBoy = await DeliveryBoy.findByIdAndUpdate(req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Delivery boy updated successfully",
      deliveryBoy: updatedDeliveryBoy,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// DELETE DELIVERY BOY
// ======================================================
exports.deleteDeliveryBoy = async (req, res) => {

  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Id"
      });
    }

    const deliveryBoy = await DeliveryBoy.findById(req.params.id);

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "Delivery Boy Not Found"
      });
    }

    const files = [
      deliveryBoy.image,
      deliveryBoy.aadhaarFront,
      deliveryBoy.aadhaarBack,
      deliveryBoy.drivingLicenseImage,
      deliveryBoy.vehicleImage,
    ];

    for (const file of files) {
      if (file?.publicId) {
        await cloudinary.uploader.destroy(file.publicId);
      }
    }

    await deliveryBoy.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Delivery Boy Deleted Successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// ======================================================
// TOGGLE ONLINE / OFFLINE
// ======================================================
exports.toggleDeliveryStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const allowedStatus = [
      "ONLINE",
      "OFFLINE",
      "ON_DELIVERY"
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Status"
      });
    }

    const deliveryBoy =
      await DeliveryBoy.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "Delivery Boy Not Found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
      deliveryBoy
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
exports.verifyDeliveryBoy = async (req, res) => {
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

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "Delivery Boy Not Found"
      });
    }

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
exports.blockDeliveryBoy = async (req, res) => {
  try {

    const deliveryBoy =
      await DeliveryBoy.findById(
        req.params.id
      );

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "Delivery Boy Not Found"
      });
    }

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
exports.getDeliveryStats = async (req, res) => {
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
      success: true,
      data: {
        totalDeliveryBoys,
        onlineDeliveryBoys,
        activeDeliveries,
        completedDeliveries
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
