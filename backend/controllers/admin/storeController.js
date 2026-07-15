const User = require("../../models/User");
const Store = require("../../models/Store");
const Product = require("../../models/VendorProduct");
const { cloudinary, deleteCloudinaryFile } = require("../../utils/cloudinary");


// Admin controller

// ================== GET ALL STORES ==================
exports.getStores = async (req, res) => {
  try {
    const stores = await Store.find().sort({ createdAt: -1 });
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching stores",
      error: error.message
    });
  }
};

// ================== CREATE STORE ==================
exports.createStore = async (req, res) => {
  try {

    const {
      firstName,
      lastName,
      mobile,
      email,
      password,
      confirmPassword,
      shopName,
      shopAddress
    } = req.body;

    // ================= EMAIL CHECK =================
    const existingStore = await Store.findOne({ email });

    if (existingStore) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const vendorImage = req.files?.vendorImage?.[0]?
     {
        url: req.files.vendorImage[0].path,
        publicId: req.files.vendorImage[0].filename,
      }
      : undefined;

    const shopLogo = req.files?.shopLogo?.[0]
      ? {
        url: req.files.shopLogo[0].path,
        publicId: req.files.shopLogo[0].filename,
      }
      : undefined;

    const shopBanner = req.files?.shopBanner?.[0]
      ? {
        url: req.files.shopBanner[0].path,
        publicId: req.files.shopBanner[0].filename,
      }
      : undefined;
    // ================= CREATE USER =================
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      mobile,
      password,
      address: shopAddress,
      pin: "000000", // or send from frontend
      role: "VENDOR",
      isEmailVerified: true,
    });

    // ================= CREATE STORE =================
    const newStore = new Store({
      owner: user._id,
      firstName,
      lastName,
      mobile,
      email,
      password,
      shopName,
      shopAddress,
      vendorImage,
      shopLogo,
      shopBanner,
    });

    await newStore.save();

    user.storeId = newStore._id;

    await user.save({
      validateBeforeSave: false,
    });

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      store: newStore
    });

  } catch (error) {

    console.log("CREATE STORE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ================== UPDATE STORE ==================
exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const updateData = { ...req.body };

    if (req.files) {

      if (req.files.vendorImage) {

        if (store.vendorImage?.publicId) {
          await deleteCloudinaryFile(store.vendorImage.publicId);
        }

        updateData.vendorImage = {
          url: req.files.vendorImage[0].path,
          publicId: req.files.vendorImage[0].filename,
        };
      }

      if (req.files.shopLogo) {

        if (store.shopLogo?.publicId) {
          await deleteCloudinaryFile(store.shopLogo.publicId);
        }

        updateData.shopLogo = {
          url: req.files.shopLogo[0].path,
          publicId: req.files.shopLogo[0].filename,
        };
      }

      if (req.files.shopBanner) {

        if (store.shopBanner?.publicId) {
          await deleteCloudinaryFile(store.shopBanner.publicId);
        }

        updateData.shopBanner = {
          url: req.files.shopBanner[0].path,
          publicId: req.files.shopBanner[0].filename,
        };
      }
    }

    const updatedStore = await Store.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.status(200).json({
      message: "Store updated successfully",
      store: updatedStore
    });

  } catch (error) {
    res.status(500).json({
      message: "Update failed",
      error: error.message
    });
  }
};

// ================== PATCH STORE ==================
exports.patchStore = async (req, res) => {
  try {
    const updatedStore = await Store.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedStore);

  } catch (error) {
    res.status(500).json({
      message: "Patch failed",
      error: error.message
    });
  }
};

// ================== DELETE STORE ==================
exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    if (store.vendorImage?.publicId) {
      await deleteCloudinaryFile(store.vendorImage.publicId);
    }

    if (store.shopLogo?.publicId) {
      await deleteCloudinaryFile(store.shopLogo.publicId);
    }

    if (store.shopBanner?.publicId) {
      await deleteCloudinaryFile(store.shopBanner.publicId);
    }

    await Store.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Store and assets deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message
    });
  }
};

// Vendor controller

// ================= ADD PRODUCT =================
exports.addProduct = async (req, res) => {
  try {
    const images = req.files?.map((file) => file.filename);

    const store = await Store.findOne({
      owner: req.user.id,
    });

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    const product = new Product({
      ...req.body,
      store: store._id,
      images,
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

exports.getMyStore = async (req, res) => {
  try {

    const store = await Store.findOne({
      owner: req.user.id,
    });

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    res.status(200).json(store);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateMyStore = async (req, res) => {
  try {

    const store = await Store.findOne({owner: req.user.id,});

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    const updateData = { ...req.body };

    if (req.files) {
      if (req.files.vendorImage) {

        if (store.vendorImage?.publicId) {
          await deleteCloudinaryFile(store.vendorImage.publicId);
        }

        updateData.vendorImage = {
          url: req.files.vendorImage[0].path,
          publicId: req.files.vendorImage[0].filename,
        };
      }

      if (req.files.shopLogo) {

        if (store.shopLogo?.publicId) {
          await deleteCloudinaryFile(store.shopLogo.publicId);
        }

        updateData.shopLogo = {
          url: req.files.shopLogo[0].path,
          publicId: req.files.shopLogo[0].filename,
        };
      }

      if (req.files.shopBanner) {

        if (store.shopBanner?.publicId) {
          await deleteCloudinaryFile(store.shopBanner.publicId);
        }

        updateData.shopBanner = {
          url: req.files.shopBanner[0].path,
          publicId: req.files.shopBanner[0].filename,
        };
      }
    }

    const updatedStore = await Store.findByIdAndUpdate(
      store._id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Store updated successfully",
      store: updatedStore,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteMyStore = async (req, res) => {
  try {

    const store = await Store.findOne({
      owner: req.user.id,
    });

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    if (store.vendorImage?.publicId) {
      await deleteCloudinaryFile(store.vendorImage.publicId);
    }

    if (store.shopLogo?.publicId) {
      await deleteCloudinaryFile(store.shopLogo.publicId);
    }

    if (store.shopBanner?.publicId) {
      await deleteCloudinaryFile(store.shopBanner.publicId);
    }

    await Store.findByIdAndDelete(store._id);

    res.status(200).json({
      message: "Store deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET SINGLE STORE =================
exports.getSingleStore = async (req, res) => {
  try {

    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    res.status(200).json({
      success: true,
      store,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};