const mongoose = require("mongoose");

const vendorproductSchema = new mongoose.Schema(
  {
    // ================= STORE RELATION =================
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },

    // ================= BASIC INFO =================
    productName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    

    // ================= CATEGORY =================
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    subCategory: {
      type: String,
      trim: true,
      default: "",
    },

    brand: {
      type: String,
      trim: true,
      default: "",
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // ================= PRICING =================
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    costPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ================= STOCK =================
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    stockStatus: {
      type: String,
      enum: [
        "IN_STOCK",
        "OUT_OF_STOCK",
        "LOW_STOCK",
      ],
      default: "IN_STOCK",
    },

    // ================= PRODUCT IMAGES =================
    thumbnail: {
      type: String,
      default: "",
    },

    images: [
      {
        type: String,
      },
    ],

    // ================= PRODUCT VARIANTS =================
    variants: [
      {
        color: {
          type: String,
          default: "",
        },

        size: {
          type: String,
          default: "",
        },

        price: {
          type: Number,
          default: 0,
        },

        stock: {
          type: Number,
          default: 0,
        },

        sku: {
          type: String,
          default: "",
        },

        image: {
          type: String,
          default: "",
        },
      },
    ],

    // ================= SHIPPING =================
    weight: {
      type: Number,
      default: 0,
    },

    dimensions: {
      length: {
        type: Number,
        default: 0,
      },

      width: {
        type: Number,
        default: 0,
      },

      height: {
        type: Number,
        default: 0,
      },
    },

    shippingCharge: {
      type: Number,
      default: 0,
    },

    // ================= SEO =================
    metaTitle: {
      type: String,
      default: "",
    },

    metaDescription: {
      type: String,
      default: "",
    },

    // ================= PRODUCT STATUS =================
    status: {
      type: String,
      enum: [
        "ACTIVE",
        "INACTIVE",
        "DRAFT",
      ],
      default: "ACTIVE",
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    approvedByAdmin: {
      type: Boolean,
      default: false,
    },

    // ================= RATINGS =================
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    totalSales: {
      type: Number,
      default: 0,
    },

    totalViews: {
      type: Number,
      default: 0,
    },

    // ================= SOFT DELETE =================
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


// ================= INDEXES =================
vendorproductSchema.index({
  productName: "text",
  category: "text",
  brand: "text",
});


// ================= EXPORT =================
module.exports = mongoose.model("Vendor-Product", vendorproductSchema);