const Product = require("../../models/Product");
const fs = require("fs");
const path = require("path");

// ================= ADD PRODUCT ================= //
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      storeId,
      category,
      subCategory,
      subSubCategory,
      brand,
      productType,
      sku,
      unit,
      unitPrice,
      minOrderQty,
      currentStock,
      discountType,
      discountAmount,
      taxAmount,
      taxCalculation,
      shippingCost,
      multiplyQty,
      videoLink,
      metaTitle,
      metaDescription,
      listingType,
      description,
      tags,
      rating,
      numRatings,
      numReviews
    } = req.body;

    if (!name || !storeId) {
      return res.status(400).json({ message: "Name & Store required" });
    }

    const price = Number(unitPrice) || 0;
    const stock = Number(currentStock) || 0;
    const minQty = Number(minOrderQty) || 1;

    if (price < 0 || stock < 0 || minQty < 0) {
      return res.status(400).json({ message: "Invalid numeric values" });
    }


    const thumbnail = req.files?.thumbnail?.[0]?.filename || null;

    const images =
      req.files?.images?.map((file) => file.filename) || [];

    const metaImage = req.files?.metaImage?.[0]?.filename || null;

    const product = await Product.create({
      name,
      description,
      storeId: req.user.storeId,
      category,
      subCategory,
      subSubCategory,
      brand,
      productType,
      sku,
      unit,
      price,
      minOrderQty: minQty,
      stock,
      discountType,
      discountAmount: Number(discountAmount) || 0,
      taxAmount: Number(taxAmount) || 0,
      taxCalculation,
      shippingCost: Number(shippingCost) || 0,
      multiplyQty: multiplyQty === "true",
      videoLink,
      metaTitle,
      metaDescription,
      listingType,

      // images
      image: thumbnail,
      images,
      metaImage,

      tags: Array.isArray(tags) ? tags : [],
      rating: Number(rating) || 0,
      numRatings: Number(numRatings) || 0,
      numReviews: Number(numReviews) || 0
    });

    res.status(201).json({
      message: "Product created successfully",
      product
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= GET ALL PRODUCTS ================= //
exports.getAllProducts = async (req, res) => {

  try {
    let { page = 1, limit = 10, category } = req.query;

    page = Math.max(1, parseInt(page));
    limit = Math.min(50, parseInt(limit));

    // Base filters: item must not be soft-deleted, and must be approved if moderation runs
    const query = { isDeleted: false };

    // If moderation status exists in schema, uncomment this line:
    // query.status = "approved";

    // 🌟 THE FIX: Directly matches against the target frontend route category parameter
    if (category) {
      // Regex match handles small discrepancies or case mismatches gracefully
      query.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    }

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    // Matches frontend response pattern perfectly: res.products
    res.status(200).json({
      success: true,
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });

  } catch (err) {
    console.error("Get Products Query Trace Error:", err);
    res.status(500).json({ message: "Server error parsing database collection" });
  }
};


// ================= GET SINGLE PRODUCT ================= //
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);

  } catch (err) {
    console.error("Get Single Product Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= UPDATE PRODUCT ================= //
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    let updateData = { ...req.body };

    if (updateData.unitPrice) updateData.price = Number(updateData.unitPrice);
    if (updateData.currentStock) updateData.stock = Number(updateData.currentStock);
    if (updateData.minOrderQty) updateData.minOrderQty = Number(updateData.minOrderQty);
    if (updateData.discountAmount) updateData.discountAmount = Number(updateData.discountAmount);
    if (updateData.taxAmount) updateData.taxAmount = Number(updateData.taxAmount);
    if (updateData.shippingCost) updateData.shippingCost = Number(updateData.shippingCost);

    // 🌟 Parse incoming dynamic rating strings into integers/floats
    if (updateData.rating) updateData.rating = Number(updateData.rating);
    if (updateData.numRatings) updateData.numRatings = Number(updateData.numRatings);
    if (updateData.numReviews) updateData.numReviews = Number(updateData.numReviews);

    if (updateData.multiplyQty) updateData.multiplyQty = updateData.multiplyQty === "true";

    // ================= IMAGE UPDATE =================
    if (req.files) {

      if (req.files.thumbnail) {
        updateData.image = req.files.thumbnail[0].filename;
      }

      if (req.files.metaImage) {
        updateData.metaImage = req.files.metaImage[0].filename;
      }

      if (req.files.images) {
        updateData.images = req.files.images.map(f => f.filename);
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};


// ================= DELETE PRODUCT ================= //
const deleteFile = (filename) => {
  if (!filename) return;

  const filePath = path.join(__dirname, "../uploads", filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    // cleanup images
    deleteFile(product.image);

    if (product.images?.length) {
      product.images.forEach(img => deleteFile(img));
    }

    deleteFile(product.metaImage);

    // soft delete
    product.isDeleted = true;
    await product.save();

    res.status(200).json({
      message: "Product deleted successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};

exports.getUniqueConcerns = async (req, res) => {
  try {
    // 1. Database se check karte hain agar concerns exist karte hain
    const uniqueConcerns = await Product.aggregate([
      { $match: { concern: { $ne: null, $exists: true, $ne: "" } } },
      {
        $group: {
          _id: { $toLower: "$concern" },
          originalTitle: { $first: "$concern" },
          img: { $first: "$thumbnail" } // 🌟 Yahan aapke route ke mutabik 'thumbnail' kar diya h
        }
      },
      { $project: { _id: 0, title: "$originalTitle", img: 1 } },
      { $limit: 8 }
    ]);

    // 2. 🌟 SAFEGUARD LOGIC (Agar database me products khali hain ya concern text missing h)
    // To Amazon/Flipkart level ke ye 8 standard items automatically frontend ko bhej diye jayenge
    if (!uniqueConcerns || uniqueConcerns.length === 0) {
      const fallbackConcerns = [
        { title: "Acne & Pimples", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80" },
        { title: "Anti-Aging", img: "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=400&q=80" },
        { title: "Dark Spots", img: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&q=80" },
        { title: "Sun Protection", img: "https://images.unsplash.com/photo-1556229174-5e42a09e45af?w=400&q=80" },
        { title: "Dry Skin", img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400&q=80" },
        { title: "Oil Control", img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80" },
        { title: "Dandruff Control", img: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=400&q=80" },
        { title: "Hair Fall", img: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=400&q=80" }
      ];

      return res.status(200).json({
        success: true,
        count: fallbackConcerns.length,
        data: fallbackConcerns
      });
    }

    return res.status(200).json({
      success: true,
      count: uniqueConcerns.length,
      data: uniqueConcerns
    });
  } catch (err) {
    console.error("Aggregation pipeline trace error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error: Could not load concerns catalog."
    });
  }
};