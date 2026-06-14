//models/VendorProduct.js

const mongoose = require("mongoose");

const vendorProductSchema = new mongoose.Schema(
  {
    // ================= STORE =================
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true
    },

    // ================= BASIC =================
    productName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    shortDescription: {
      type: String,
      default: "",
      maxlength: 500
    },

    description: {
      type: String,
      required: true
    },

    productType: {
      type: String,
      enum: ["Physical", "Digital"],
      default: "Physical"
    },

    // ================= CATEGORY =================
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },

    subSubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand"
    },

    tags: [String],

    searchKeywords: [String],

    // ================= PRICING =================
    price: {
      type: Number,
      required: true,
      min: 0
    },

    costPrice: {
      type: Number,
      default: 0
    },

    discountType: {
      type: String,
      enum: ["Flat", "Percent"],
      default: "Flat"
    },

    discountAmount: {
      type: Number,
      default: 0
    },

    discountPrice: {
      type: Number,
      default: 0
    },

    // ================= GST =================
    hsnCode: {
      type: String,
      default: ""
    },

    taxAmount: {
      type: Number,
      default: 0
    },

    taxCalculation: {
      type: String,
      enum: [
        "Include with product",
        "Exclude"
      ],
      default: "Include with product"
    },

    // ================= STOCK =================
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    minOrderQty: {
      type: Number,
      default: 1
    },

    sku: {
      type: String,
      unique: true,
      sparse: true
    },

    barcode: {
      type: String,
      default: ""
    },

    stockStatus: {
      type: String,
      enum: [
        "IN_STOCK",
        "LOW_STOCK",
        "OUT_OF_STOCK"
      ],
      default: "IN_STOCK"
    },

    // ================= MEDIA =================
    thumbnail: {
      publicId: {
        type: String,
        default: ""
      },
      url: {
        type: String,
        default: ""
      }
    },

    images: [
      {
        publicId: String,
        url: String
      }
    ],

    metaImage: {
      publicId: {
        type: String,
        default: ""
      },
      url: {
        type: String,
        default: ""
      }
    },

    videoLink: {
      type: String,
      default: ""
    },


    // ================= VARIANTS =================
    variants: [
      {
        color: String,
        size: String,

        sku: String,

        price: Number,

        discountPrice: Number,

        stock: Number,

        image: String,

        isDefault: {
          type: Boolean,
          default: false
        }
      }
    ],

    // ================= SHIPPING =================
    shippingCharge: {
      type: Number,
      default: 0
    },

    shippingType: {
      type: String,
      enum: ["FREE", "PAID"],
      default: "PAID"
    },

    weight: {
      type: Number,
      default: 0
    },

    weightUnit: {
      type: String,
      enum: ["gms", "kg", "pc", "pcs", "ml", "ltr", "pair"],
      default: "kg"
    },

    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },

    deliveryTime: {
      type: String,
      default: ""
    },

    estimatedDeliveryDays: {
      type: Number,
      default: 3
    },

    countryOfOrigin: {
      type: String,
      default: "India"
    },

    // ================= SEO =================
    metaTitle: {
      type: String,
      default: ""
    },

    metaDescription: {
      type: String,
      default: ""
    },

    metaKeywords: [String],

    canonicalUrl: {
      type: String,
      default: ""
    },

    // ================= EXTRA =================
    warranty: {
      type: String,
      default: ""
    },

    returnPolicy: {
      type: String,
      default: ""
    },

    faq: [
      {
        question: String,
        answer: String
      }
    ],

    attributes: [
      {
        name: String,
        values: [String]
      }
    ],

    // ================= LISTING =================
    listingType: {
      type: String,
      enum: [
        "BESTSELLER",
        "NEW_ARRIVAL",
        "COMBOS"
      ],
      default: "BESTSELLER"
    },

    featured: {
      type: Boolean,
      default: false
    },

    featuredOrder: {
      type: Number,
      default: 0
    },

    // ================= ANALYTICS =================
    soldCount: {
      type: Number,
      default: 0
    },

    totalSales: {
      type: Number,
      default: 0
    },

    totalViews: {
      type: Number,
      default: 0
    },

    wishlistCount: {
      type: Number,
      default: 0
    },

    // ================= REVIEW  =================
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    totalReviews: {
      type: Number,
      default: 0
    },

    // ================= ADMIN =================
    addedBy: {
      type: String,
      enum: ["ADMIN", "VENDOR"],
      default: "ADMIN"
    },

    approvedByAdmin: {
      type: Boolean,
      default: false
    },

    adminRemarks: {
      type: String,
      default: ""
    },

    rejectionReason: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "INACTIVE",
        "DRAFT"
      ],
      default: "ACTIVE"
    },

    publishedAt: {
      type: Date,
      default: Date.now
    },

    // ================= SOFT DELETE =================
    isDeleted: {
      type: Boolean,
      default: false
    },

    deletedAt: {
      type: Date,
      default: null
    },

    // ================= RETURN =================
    returnable: {
      type: Boolean,
      default: true
    },

    returnDays: {
      type: Number,
      default: 7
    },

  },
  {
    timestamps: true
  }
);


//slug generate
vendorProductSchema.pre("save", function () {

  if (!this.slug) {

    this.slug =
      this.productName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      Date.now();

  }
});


//sku generate
vendorProductSchema.pre("save", function () {

  if (!this.sku) {

    this.sku =
      "SKU-" +
      Date.now() +
      "-" +
      Math.floor(Math.random() * 10000);

  }

});


//discount price auto calculate
vendorProductSchema.pre("save", function () {

  if (this.discountAmount > 0) {

    if (this.discountType === "Flat") {

      this.discountPrice =
        Math.max(
          this.price - this.discountAmount,
          0
        );

    } else {

      this.discountPrice =
        Math.max(
          this.price -
          (this.price * this.discountAmount) / 100,
          0
        );

    }
  }

});

//stock status auto update
vendorProductSchema.pre("save", function () {

  if (this.stock <= 0) {

    this.stockStatus = "OUT_OF_STOCK";

  } else if (this.stock <= 10) {

    this.stockStatus = "LOW_STOCK";

  } else {

    this.stockStatus = "IN_STOCK";

  }

});


// ================= INDEXES =================
vendorProductSchema.index({
  productName: "text",
  brand: "text",
  category: "text"
});

vendorProductSchema.index({
  status: 1,
  approvedByAdmin: 1
});

vendorProductSchema.index({
  featured: 1,
  featuredOrder: 1
});

vendorProductSchema.index({
  category: 1,
  subCategory: 1
});

vendorProductSchema.index({
  soldCount: -1
});

vendorProductSchema.index({
  createdAt: -1
});


// ================= EXPORT =================
module.exports = mongoose.model("Vendor-Product", vendorProductSchema);