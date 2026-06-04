const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  // Split name into First and Last to match frontend
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"]
  },
  address: {
    type: String,
    required: [true, "Address is required"]
  },

  // Identity Information
  identityType: {
    type: String,
    enum: ["Passport", "Driving License", "NID"],
    required: [true, "Identity type is required"]
  },
  identityNumber: {
    type: String,
    required: [true, "Identity number is required"]
  },

  // Image Paths
  employeeImage: {
    type: String, // Path to the profile image
    required: [true, "Employee image is required"]
  },
  identityImage: {
    type: String, // Path to the ID document image
    required: [true, "Identity image is required"]
  },

  // Metadata & Access
  role: {
    type: String,
    enum: ["ADMIN", "MANAGER", "EDITOR", "SUPPORT", "DELIVERY"],
    default: "EDITOR"
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
}, { 
  timestamps: true // Automatically creates createdAt and updatedAt
});

module.exports = mongoose.model("Employee", employeeSchema);