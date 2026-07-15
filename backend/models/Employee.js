const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    // ===========================
    // Basic Information
    // ===========================
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: [6, "Password must be at least 6 characters"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      maxlength: [300, "Address cannot exceed 300 characters"],
    },

    // ===========================
    // Identity Information
    // ===========================
    identityType: {
      type: String,
      enum: ["Passport", "Driving License", "NID"],
      required: [true, "Identity type is required"],
    },

    identityNumber: {
      type: String,
      required: [true, "Identity number is required"],
      trim: true,
    },

    // ===========================
    // Cloudinary Images
    // ===========================
    employeeImage: {
      public_id: {
        type: String,
        required: [true, "Employee image public_id is required"],
      },
      url: {
        type: String,
        required: [true, "Employee image URL is required"],
      },
    },

    identityImage: {
      public_id: {
        type: String,
        required: [true, "Identity image public_id is required"],
      },
      url: {
        type: String,
        required: [true, "Identity image URL is required"],
      },
    },

    // ===========================
    // Role & Status
    // ===========================
    role: {
      type: String,
      enum: ["ADMIN", "MANAGER", "EDITOR", "SUPPORT", "DELIVERY"],
      default: "EDITOR",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // ===========================
    // Soft Delete
    // ===========================
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  }
);

// ===========================
// Indexes
// ===========================
employeeSchema.index({ email: 1 });
employeeSchema.index({ status: 1 });
employeeSchema.index({ role: 1 });

// ===========================
// Virtual Fields
// ===========================
employeeSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("Employee", employeeSchema);