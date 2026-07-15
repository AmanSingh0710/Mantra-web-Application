//controller/Vendor/vendorStoreController

const Product = require("../../models/VendorProduct");
const Store = require("../../models/Store");
const Order = require("../../models/Order");
const fs = require("fs");
const path = require("path");


// ================= DELETE FILE =================
const deleteFile = (filename) => {
  if (!filename) return;

  const filePath = path.join(
    __dirname,
    "../uploads",
    filename
  );

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// ================= GET MY STORE =================
exports.getMyStore = async (req, res) => {
  try {

    const store = await Store.findOne({
      owner: req.user.id,
    }).populate(
      "owner",
      "firstName lastName email mobile image"
    );

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    res.status(200).json(store);

  } catch (error) {

    res.status(500).json({
      message: "Fetch store failed",
      error: error.message,
    });

  }
};


// ================= ADD PRODUCT =================
exports.addProduct = async (req, res) => {
  try {

    // thumbnail
    const thumbnail =
      req.files?.thumbnail?.[0]?.filename || "";

    // gallery images
    const images =
      req.files?.images?.map(
        (file) => file.filename
      ) || [];

    const metaImage =
      req.files?.metaImage?.[0]?.filename || "";




    const product = new Product({
      ...req.body,
      store: req.user.storeId,
      thumbnail,
      images,
      metaImage,
      addedBy: "VENDOR",
      approvedByAdmin: false,
      status: "DRAFT",
    });


    await product.save();

    res.status(201).json({
      message: "Product added successfully",
      product,
    });

  } catch (error) {

    res.status(500).json({
      message: "Add product failed",
      error: error.message,
    });

  }
};


// ================= GET MY PRODUCTS =================
exports.getVendorProducts = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const query = {
      store: req.user.storeId,
      isDeleted: false
    };

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// ================= GET SINGLE PRODUCT =================
exports.getSingleProduct = async (req, res) => {
  try {

    const product = await Product.findOne({
      _id: req.params.id,
      store: req.user.storeId,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);

  } catch (error) {

    res.status(500).json({
      message: "Fetch failed",
      error: error.message,
    });

  }
};


// ================= UPDATE PRODUCT =================
exports.updateProduct = async (req, res) => {
  try {

    const product = await Product.findOne({
      _id: req.params.id,
      store: req.user.storeId,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const updateData = {
      ...req.body,
    };

    let thumbnail = product.thumbnail;
    let images = product.images;

    // update thumbnail
    if (req.files?.thumbnail) {

      deleteFile(product.thumbnail);

      updateData.thumbnail =
        req.files.thumbnail[0].filename;
    }

    // update gallery images
    if (req.files?.images) {

      // delete old images
      product.images.forEach((img) => {
        deleteFile(img);
      });

      updateData.images =
        req.files.images.map(
          (file) => file.filename
        );
    }

    // update Meta images
    if (req.files?.metaImage) {

      deleteFile(product.metaImage);

      updateData.metaImage =
        req.files.metaImage[0].filename;
    }
   
    updateData.approvedByAdmin = false;
    updateData.status = "DRAFT";

    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );


    res.status(200).json({
      message: "Product updated",
      product: updatedProduct,
    });

  } catch (error) {

    res.status(500).json({
      message: "Update failed",
      error: error.message,
    });

  }
};


// ================= DELETE PRODUCT =================
exports.deleteProduct = async (req, res) => {
  try {

    const product = await Product.findOne({
      _id: req.params.id,
      store: req.user.storeId,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // delete thumbnail
    deleteFile(product.thumbnail);

    // delete gallery images
    product.images.forEach((img) => {
      deleteFile(img);
    });

     // delete metaImage
    deleteFile(product.metaImage);

    // soft delete
    product.isDeleted = true;
    product.deletedAt = new Date();

    await product.save();

    res.status(200).json({
      message: "Product deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });

  }
};

// ================= GET VENDOR ORDERS =================
exports.getVendorOrders = async (req, res) => {
  try {

    // ================= GET VENDOR STORE =================
    const store = await Store.findOne({
      owner: req.user.id,
    });

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    // ================= GET ONLY THIS STORE ORDERS =================
    const orders = await Order.find({
      store: store._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Orders fetch failed",
      error: error.message,
    });

  }
};


// ================= VENDOR DASHBOARD STATS =================
exports.getVendorStats = async (req, res) => {
  try {

    const storeId = req.user.storeId;
    // ================= TOTAL PRODUCTS =================
    const totalProducts =
      await Product.countDocuments({
        store: storeId,
        isDeleted: false,
      });

    // ================= TOTAL STOCK =================
    const stockResult =
      await Product.aggregate([
        {
          $match: {
            store: req.user.storeId,
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: null,
            totalStock: {
              $sum: "$stock",
            },
          },
        },
      ]);

    // ================= ACTIVE PRODUCTS =================
    const activeProducts =
      await Product.countDocuments({
        store: storeId,
        status: "ACTIVE",
        isDeleted: false,
      });

    // ================= GROWTH =================
    const growth =
      totalProducts > 0
        ? Math.round(
          (activeProducts / totalProducts) * 100
        )
        : 0;

    res.status(200).json({
      totalShops: 1,
      inventory:
        stockResult[0]?.totalStock || 0,
      vendors: 1,
      growth,
    });

  } catch (error) {

    res.status(500).json({
      message: "Dashboard stats failed",
      error: error.message,
    });

  }
};

exports.updateMyStore = async (req, res) => {
  try {

    const store = await Store.findOne({
      owner: req.user.id,
    });

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    const updateData = {
      ...req.body,
    };

    // ================= IMAGES =================
    if (req.files) {

      // Vendor Image
      if (req.files.vendorImage) {

        deleteFile(store.vendorImage);

        updateData.vendorImage =
          req.files.vendorImage[0].filename;
      }

      // Shop Logo
      if (req.files.shopLogo) {

        deleteFile(store.shopLogo);

        updateData.shopLogo =
          req.files.shopLogo[0].filename;
      }

      // Shop Banner
      if (req.files.shopBanner) {

        deleteFile(store.shopBanner);

        updateData.shopBanner =
          req.files.shopBanner[0].filename;
      }
    }

    // ================= PASSWORD UPDATE =================
    if (
      req.body.newPassword &&
      req.body.currentPassword
    ) {

      const isMatch =
        await store.comparePassword(
          req.body.currentPassword
        );

      if (!isMatch) {
        return res.status(400).json({
          message: "Current password incorrect",
        });
      }

      store.password = req.body.newPassword;

      await store.save();
    }

    // ================= UPDATE STORE =================
    const updatedStore =
      await Store.findByIdAndUpdate(
        store._id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    // ================= UPDATE USER =================
    await User.findByIdAndUpdate(
      req.user.id,
      {
        mobile: req.body.mobile,
        email: req.body.email,
      }
    );

    res.status(200).json({
      success: true,
      message: "Store updated successfully",
      store: updatedStore,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};