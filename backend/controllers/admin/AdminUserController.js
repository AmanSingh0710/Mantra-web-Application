const User = require("../../models/User");
const Store = require("../../models/Store");
const mongoose = require("mongoose");

// ================= 1. GET ALL PENDING VENDORS =================
exports.getPendingVendors = async (req, res) => {
  try {
    // Finds all users registered as VENDOR whose accounts are not yet verified/unblocked
    const pendingVendors = await User.find({ 
      role: "VENDOR", 
      blocked: true, 
      isDeleted: false 
    }).select("-password");

    res.status(200).json({
      success: true,
      count: pendingVendors.length,
      vendors: pendingVendors
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch pending vendors" });
  }
};

// ================= 2. APPROVE OR REJECT A VENDOR =================
exports.reviewVendorAccount = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { action } = req.body; // Expected values: "APPROVE" or "REJECT"

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ success: false, message: "Invalid Vendor ID format" });
    }

    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== "VENDOR") {
      return res.status(404).json({ success: false, message: "Vendor account not found" });
    }

    if (action === "APPROVE") {
      vendor.blocked = false; // Unblock their login capability
      vendor.isEmailVerified = true; // Auto-verify setup metrics if applicable
      
      // Update their associated store profile status to ACTIVE
      if (vendor.storeId) {
        await Store.findByIdAndUpdate(vendor.storeId, { status: "ACTIVE" });
      }
    } else {
      vendor.blocked = true;
      if (vendor.storeId) {
        await Store.findByIdAndUpdate(vendor.storeId, { status: "INACTIVE" });
      }
    }

    await vendor.save();

    res.status(200).json({
      success: true,
      message: `Vendor account has been successfully ${action === "APPROVE" ? "Approved & Unblocked" : "Rejected & Suspended"}.`,
      vendor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};