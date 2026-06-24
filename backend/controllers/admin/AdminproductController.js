const Product = require("../../models/VendorProduct");
const Review = require("../../models/Review");
const deleteCloudinaryFile = require("../../utils/cloudinary");
const path = require("path");
const excelJS = require("exceljs");
const mongoose = require("mongoose");



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
exports.getPublicProducts = async (req, res) => {
  try {
    const { category } = req.query;

    const matchStage = {status: "ACTIVE",approvedByAdmin: true,isDeleted: false,};

    const pipeline = [
      {$match: matchStage,},

      // Category
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Sub Category
      {
        $lookup: {
          from: "categories",
          localField: "subCategory",
          foreignField: "_id",
          as: "subCategory",
        },
      },
      {
        $unwind: {
          path: "$subCategory",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Sub Sub Category
      {
        $lookup: {
          from: "categories",
          localField: "subSubCategory",
          foreignField: "_id",
          as: "subSubCategoryData",
        },
      },
      {
        $unwind: {
          path: "$subSubCategoryData",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Brand
      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $unwind: {
          path: "$brand",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Reviews
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "productId",
          as: "productReviews",
        },
      },

      {
        $addFields: {
          activeReviews: {
            $filter: {
              input: "$productReviews",
              as: "review",
              cond: {
                $eq: ["$$review.status", "active"],
              },
            },
          },
        },
      },
    ];

    // CATEGORY FILTER
    if (category && category !== "all products") {
      pipeline.push({
        $match: {
          $or: [
            {
              "category.name": {
                $regex: category,
                $options: "i",
              },
            },
            {
              "subCategory.name": {
                $regex: category,
                $options: "i",
              },
            },
            {
              "subSubCategoryData.name": {
                $regex: category,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    pipeline.push(
      {
        $project: {
          _id: 1,
          productName: 1,
          slug: 1,
          shortDescription: 1,
          description: 1,

          price: 1,
          discountPrice: 1,
          discountAmount: 1,
          discountType: 1,

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

          createdAt: 1,

          category: {
            _id: "$category._id",
            name: "$category.name",
          },

          subCategory: {
            _id: "$subCategory._id",
            name: "$subCategory.name",
          },

          subSubCategory: {
            _id: "$subSubCategoryData._id",
            name: "$subSubCategoryData.name",
          },

          brand: {
            _id: "$brand._id",
            name: "$brand.name",
          },

          averageRating: {
            $round: [
              {
                $cond: [
                  { $gt: [{ $size: "$activeReviews" }, 0] },
                  { $avg: "$activeReviews.rating" },
                  0,
                ],
              },
              1,
            ],
          },

          totalReviews: {
            $size: "$activeReviews",
          },
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      }
    );

    const productsWithRatings = await Product.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      products: productsWithRatings,
    });
  } catch (error) {
    console.error("Public Storefront Aggregation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to assemble catalog elements",
    });
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

    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("subSubCategory", "name")
      .populate("brand", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const reviews = await Review.find({
      productId: product._id,
      status: "ACTIVE",
    })
      .populate("customerId", "name")
      .sort({ createdAt: -1 });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) /
        reviews.length
        : 0;

    res.status(200).json({
      success: true,
      product: {
        ...product.toObject(),
        averageRating,
        totalReviews: reviews.length,
      },
      reviews,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= 4. TOGGLE STATUS (Featured / Operational States) =================
exports.toggleStatus = async (req, res) => {
  try {
    const { id, field, value } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product identifier provided"
      });
    }

    const allowedFields = ["featured", "isDeleted", "status"];

    if (!allowedFields.includes(field)) {
      return res.status(400).json({
        success: false,
        message: "Target modification parameter is restricted"
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product record not found"
      });
    }

    if (field === "status") {
      product.status = value;
    } else {
      product[field] = !product[field];
    }

    if (field === "isDeleted" && product.isDeleted) {
      product.deletedAt = new Date();
      product.status = "INACTIVE";
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: `${field} updated successfully`,
      product
    });

  } catch (err) {
    console.error("Toggle Status Error:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
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

//  admin get concern prduct by id 
exports.getProductsByConcern = async (req, res) => {
  try {

    const { concernId } = req.params;

    const products = await Product.find({ concerns: concernId }).populate("concerns");

    return res.status(200).json({
      success: true,
      products
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// user get concern prduct by id 
exports.getPublicProductsByConcern = async (req, res) => {
  try {

    const products = await Product.find({
      concerns: req.params.concernId,
      status: "ACTIVE"
    }).populate("concerns");;

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

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