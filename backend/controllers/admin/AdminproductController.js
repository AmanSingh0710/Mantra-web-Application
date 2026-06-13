const Product = require("../../models/VendorProduct");
const Review = require("../../models/Review");
const deleteCloudinaryFile = require("../../utils/cloudinary");
const fs = require("fs");
const path = require("path");
const excelJS = require("exceljs");
const mongoose = require("mongoose");

// ================= FILE REMOVAL HELPER =================
const safelyDeleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, "../uploads", filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error(`Failed to delete asset: ${filename}`, unlinkErr);
      });
    }
  });
};

// ================= 1. GET ALL SYSTEM PRODUCTS (Admin View with Pagination) =================
exports.getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search, status, approval } = req.query;

    page = Math.max(1, parseInt(page));
    limit = Math.min(100, parseInt(limit));

    const filterQuery = { isDeleted: false };

    // Advanced search filters
    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filterQuery.productName = { $regex: safeSearch, $options: "i" };
    }
    if (status) filterQuery.status = status; // e.g., "ACTIVE", "INACTIVE", "DRAFT"
    if (approval) filterQuery.approvedByAdmin = approval === "true";


    if (req.query.category) {
      filterQuery.category = req.query.category;
    }

    if (req.query.brand) {
      filterQuery.brand = req.query.brand;
    }

    if (req.query.featured) {
      filterQuery.featured =
        req.query.featured === "true";
    }

    const products = await Product.find(filterQuery)
      .populate("store", "storeName")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .lean();

    const count = await Product.countDocuments(filterQuery);

    res.status(200).json({
      success: true,
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error fetching catalog metrics" });
  }
};

// ================= 2. GET PUBLIC STOREFRONT (Calculates Real-time Aggregate Ratings) =================
// 🌟 FIXES N+1 QUERY BUG: Replaced mapping queries with a single database pipeline aggregation matrix.
exports.getPublicProducts = async (req, res) => {
  try {
    const productsWithRatings = await Product.aggregate([
      {
        $match: {
          status: "ACTIVE",
          approvedByAdmin: true,
          isDeleted: false
        }
      },
      {
        $lookup: {
          from: "reviews", // Collections named by mongoose are usually lowercase plurals
          localField: "_id",
          foreignField: "productId",
          as: "productReviews"
        }
      },
      {
        $addFields: {
          activeReviews: {
            $filter: {
              input: "$productReviews",
              as: "rev",
              cond: { $eq: ["$$rev.status", "active"] }
            }
          }
        }
      },
      {
        $project: {
          productName: 1,
          slug: 1,
          shortDescription: 1,
          description: 1,
          category: 1,
          subCategory: 1,
          brand: 1,
          price: 1,
          discountPrice: 1,
          stock: 1,
          stockStatus: 1,
          thumbnail: 1,
          images: 1,
          metaImage: 1,
          listingType: 1,
          tags: 1,
          featured: 1,
          totalSales: 1,
          variants: 1,
          featured: 1,
          averageRating: {
            $cond: [
              { $gt: [{ $size: "$activeReviews" }, 0] },
              { $avg: "$activeReviews.rating" },
              0
            ]
          },
          totalReviews: { $size: "$activeReviews" }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json({ success: true, products: productsWithRatings });
  } catch (error) {
    console.error("Public Storefront Aggregation Error:", error);
    res.status(500).json({ success: false, message: "Failed to assemble catalog elements" });
  }
};


// ================= 3. SYSTEM ADMINISTRATION MANUAL ADDITION =================
exports.addProduct = async (req, res) => {
  try {
    const { productName, description, category, price, stock, brand } = req.body;

    if (!productName || !description || !category || !price || !stock) {
      return res.status(400).json({ success: false, message: "Missing required catalog fields" });
    }

    const generatedSlug = productName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const productData = {
      ...req.body,
      slug: req.body.slug || `${generatedSlug}-${Date.now()}`,
      price: Number(price),
      stock: Number(stock),
      approvedByAdmin: true, // Platform-added inventory bypasses moderation
      status: "ACTIVE"
    };

    if (req.files) {
      if (req.files?.thumbnail) {
        productData.thumbnail = {
          publicId: req.files.thumbnail[0].filename,
          url: req.files.thumbnail[0].path
        };
      }

      if (req.files?.images) {
        productData.images = req.files.images.map(file => ({
          publicId: file.filename,
          url: file.path
        }));
      }

      if (req.files?.metaImage) {
        productData.metaImage = {
          publicId: req.files.metaImage[0].filename,
          url: req.files.metaImage[0].path
        };
      }
    }

    const newProduct = await Product.create(productData);
    res.status(201).json({ success: true, message: "Product listed on system core", product: newProduct });
  } catch (err) {
    console.error("Admin Product Manual Add Error:", err);
    res.status(500).json({ success: false, message: "Failed to create catalog instance", error: err.message });
  }
};

exports.getPublicProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================= 4. TOGGLE STATUS (Featured / Operational States) =================
exports.toggleStatus = async (req, res) => {
  try {
    const { id, field } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product identifier provided" });
    }

    const allowedFields = ["featured", "isDeleted"]; // Synced with real fields
    if (!allowedFields.includes(field)) {
      return res.status(400).json({ success: false, message: "Target modification parameter is restricted" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product record not found" });

    product[field] = !product[field];
    if (field === "isDeleted" && product.isDeleted) {
      product.deletedAt = new Date();
      product.status = "INACTIVE";
    }

    await product.save();
    res.status(200).json({ success: true, message: `Parameter ${field} updated successfully`, status: product[field] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Toggle operations pipeline failed" });
  }
};

// ================= 5. PERMANENT DELETE (Purge Storage Assets & Document) =================
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Malformed identifier token" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Target document missing" });

    if (product.thumbnail?.publicId) {
      await deleteCloudinaryFile(
        product.thumbnail.publicId
      );
    }

    if (product.metaImage?.publicId) {
      await deleteCloudinaryFile(
        product.metaImage.publicId
      );
    }

    for (const image of product.images) {
      await deleteCloudinaryFile(
        image.publicId
      );
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product completely purged from database ecosystem" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Purge sequence execution failure" });
  }
};

// ================= 6. MARKETPLACE VENDOR MODERATION TOGGLE =================
exports.toggleProductApproval = async (req, res) => {
  try {
    const { productId } = req.params;
    const { action } = req.body; // Expected strings: "APPROVE" or "REJECT"

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product key reference" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product item missing" });

    if (action === "APPROVE") {
      product.approvedByAdmin = true;
      product.status = "ACTIVE";
    } else {
      product.approvedByAdmin = false;
      product.status = "INACTIVE";
    }

    await product.save();
    res.status(200).json({
      success: true,
      message: `Product listing has been successfully ${action === "APPROVE" ? "approved for live storefront visualization" : "rejected back to vendor catalog"}.`,
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= 8. UPDATE PRODUCT PROFILE (Admin Property Override) =================
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product identifier" });
    }

    // Explicit list of editable schema properties 
    const allowedFields = [
      "productName",
      "shortDescription",
      "description",
      "category",
      "subCategory",
      "subSubCategory",
      "brand",
      "price",
      "discountPrice",
      "costPrice",
      "stock",
      "sku",
      "status",
      "featured",
      "productType",
      "unit",
      "minOrderQty",
      "videoLink",
      "listingType",
      "tax",
      "discountType",
      "discountAmount",
      "taxAmount",
      "taxCalculation",
      "multiplyQty",
      "weight",
      "shippingCharge",
      "metaTitle",
      "metaDescription"
    ];


    let updateData = {};

    const oldProduct = await Product.findById(id);

    if (!oldProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }


    // Safely extract inputs and convert types where necessary
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === "price" || field === "discountPrice" || field === "stock") {
          updateData[field] = Number(req.body[field]) || 0;
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    if (req.files?.thumbnail) {

      if (oldProduct.thumbnail?.publicId) {

        await deleteCloudinaryFile(
          oldProduct.thumbnail.publicId
        );

      }

      updateData.thumbnail = {
        publicId:
          req.files.thumbnail[0].filename,
        url:
          req.files.thumbnail[0].path
      };
    }

    if (req.files?.images) {

      for (const image of oldProduct.images) {

        await deleteCloudinaryFile(
          image.publicId
        );

      }

      updateData.images =
        req.files.images.map(file => ({
          publicId: file.filename,
          url: file.path
        }));
    }

    if (req.files?.metaImage) {

      if (oldProduct.metaImage?.publicId) {

        await deleteCloudinaryFile(
          oldProduct.metaImage.publicId
        );

      }

      updateData.metaImage = {
        publicId:
          req.files.metaImage[0].filename,
        url:
          req.files.metaImage[0].path
      };
    }



    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Target product record not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product catalog updated successfully",
      product: updatedProduct
    });

  } catch (error) {
    console.error("Admin Product Update Route Failure:", error);
    res.status(500).json({ success: false, message: "Failed to update target product record" });
  }
};

// ================= 7. BULK EXCEL SHEET INGESTION ENGINE =================
exports.bulkImportProducts = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Please supply a valid matrix spreadsheet file" });

    const filePath = req.file.path;
    const workbook = new excelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(1);
    const parsedProducts = [];

    // 🌟 FIX: Pre-extracted out loop variable initialization constraint dependency crash
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber > 1) {
        const pName = row.getCell(1).value?.toString() || "";
        if (!pName) return; // Skip structural blank rows safely

        const generatedSlug = pName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

        parsedProducts.push({
          productName: pName,
          description: row.getCell(2).value?.toString() || "No description provided",
          category: row.getCell(3).value?.toString() || "General",
          brand: row.getCell(4).value?.toString() || "Generic",
          price: Number(row.getCell(5).value) || 0,
          stock: Number(row.getCell(6).value) || 0,
          sku: row.getCell(7).value?.toString() || `SKU-${generatedSlug}-${Date.now()}-${rowNumber}`,
          slug: `${generatedSlug}-${Date.now()}-${rowNumber}`,
          status: "ACTIVE",
          approvedByAdmin: true
        });
      }
    });

    if (parsedProducts.length > 2000) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({ success: false, message: "Payload size threshold exceeded limit (Max 2000 lines)" });
    }

    if (parsedProducts.length > 0) {
      await Product.insertMany(parsedProducts);
    }

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: `System successfully synchronized ${parsedProducts.length} entries to storefront live catalog cluster.`,
      total: parsedProducts.length
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("Bulk Import Engine Crash:", err);
    res.status(500).json({ success: false, message: "Bulk import execution anomaly detected", error: err.message });
  }
};