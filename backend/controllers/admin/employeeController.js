const Employee = require("../../models/Employee");
const Deliveryman = require("../../models/Deliveryman/DeliveryMan");
const { deleteCloudinaryFile } = require("../../utils/cloudinary");
const bcrypt = require("bcrypt");


//controllers/admin/employeeController.js

// CREATE EMPLOYEE
exports.createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
      address,
      identityType,
      identityNumber,
    } = req.body;

    // ==========================
    // Validation
    // ==========================

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phone ||
      !address ||
      !identityType ||
      !identityNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    if (!req.files?.employee_image?.length) {
      return res.status(400).json({
        success: false,
        message: "Employee image is required.",
      });
    }

    if (!req.files?.identity_image?.length) {
      return res.status(400).json({
        success: false,
        message: "Identity image is required.",
      });
    }

    // ==========================
    // Check Email
    // ==========================

    const existingEmployee = await Employee.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // ==========================
    // Hash Password
    // ==========================

    const hashedPassword = await bcrypt.hash(password, 12);

    // ==========================
    // Cloudinary Images
    // ==========================

    const employeeImage = req.files.employee_image[0];

    const identityImage = req.files.identity_image[0];

    // ==========================
    // Create Employee
    // ==========================

    const employee = await Employee.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),

      password: hashedPassword,

      phone: phone.trim(),

      address: address.trim(),

      role,

      identityType,

      identityNumber,

      employeeImage: {
        public_id: employeeImage.filename,
        url: employeeImage.path,
      },

      identityImage: {
        public_id: identityImage.filename,
        url: identityImage.path,
      },
    });

    const employeeData = employee.toObject();

    delete employeeData.password;

    return res.status(201).json({
      success: true,
      message: "Employee created successfully.",
      data: employeeData,
    });
  } catch (error) {

    // ==========================
    // Delete Uploaded Images
    // If Mongo Save Failed
    // ==========================

    try {

      if (req.files?.employee_image?.length) {

        await deleteCloudinaryFile(
          req.files.employee_image[0].filename
        );

      }

      if (req.files?.identity_image?.length) {

        await deleteCloudinaryFile(
          req.files.identity_image[0].filename
        );

      }

    } catch (cloudinaryError) {

      console.log("Cloudinary Cleanup Error:", cloudinaryError.message);

    }

    console.log("Create Employee Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create employee.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// GET ALL STAFF (Employees + Delivery Boys)
exports.getEmployees = async (req, res) => {
  try {
    // Fetch both collections in parallel
    const [employees, deliverymen] = await Promise.all([
      Employee.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .lean(),

      Deliveryman.find()
        .select("-password -refreshToken")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    // Normalize Employee Data
    const employeeData = employees.map((emp) => ({
      _id: emp._id,
      type: "EMPLOYEE",

      name: `${emp.firstName} ${emp.lastName}`.trim(),
      firstName: emp.firstName,
      lastName: emp.lastName,

      email: emp.email,
      phone: emp.phone,

      role: emp.role,
      status: emp.status,

      image: emp.employeeImage,

      createdAt: emp.createdAt,
      updatedAt: emp.updatedAt,
    }));

    // Normalize Delivery Boy Data
    const deliveryData = deliverymen.map((delivery) => ({
      _id: delivery._id,
      type: "DELIVERY_BOY",

      name: delivery.name,

      email: delivery.email,
      phone: delivery.mobile,

      role: "DELIVERY",

      // Keep actual delivery status
      status: delivery.status,

      // Separate blocked flag
      isBlocked: delivery.isBlocked,

      image: delivery.image,

      totalDeliveries: delivery.totalDeliveries,
      totalEarnings: delivery.totalEarnings,
      walletBalance: delivery.walletBalance,

      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt,
    }));

    // Merge & Sort Latest First
    const staff = [...employeeData, ...deliveryData].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.status(200).json({
      success: true,
      message: "Staff fetched successfully.",
      count: staff.length,
      data: staff,
    });

  } catch (error) {
    console.error("Get Employees Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching staff.",
    });
  }
};

// UPDATE EMPLOYEE
exports.updateEmployee = async (req, res) => {
  try {

    const { id } = req.params;

    const employee = await Employee.findOne({ _id: id, isDeleted: false, });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
      address,
      identityType,
      identityNumber,
      status,
    } = req.body;

    // ==================================
    // Email Duplicate Check
    // ==================================

    if (email && email !== employee.email) {

      const exists = await Employee.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id },
      });

      if (exists) {
        return res.status(409).json({
          success: false,
          message: "Email already exists.",
        });
      }

      employee.email = email.toLowerCase().trim();
    }

    // ==================================
    // Basic Fields
    // ==================================

    if (firstName) employee.firstName = firstName.trim();

    if (lastName) employee.lastName = lastName.trim();

    if (phone) employee.phone = phone.trim();

    if (address) employee.address = address.trim();

    if (role) employee.role = role;

    if (status) employee.status = status;

    if (identityType) employee.identityType = identityType;

    if (identityNumber)
      employee.identityNumber = identityNumber;

    // ==================================
    // Password
    // ==================================

    if (password && password.trim() !== "") {

      employee.password = await bcrypt.hash(password, 12);

    }

    // ==================================
    // Employee Image
    // ==================================

    if (req.files?.employee_image?.length) {

      if (employee.employeeImage?.public_id) {

        await deleteCloudinaryFile(
          employee.employeeImage.public_id
        );

      }

      employee.employeeImage = {
        public_id: req.files.employee_image[0].filename,
        url: req.files.employee_image[0].path,
      };

    }

    // ==================================
    // Identity Image
    // ==================================

    if (req.files?.identity_image?.length) {

      if (employee.identityImage?.public_id) {

        await deleteCloudinaryFile(
          employee.identityImage.public_id
        );

      }

      employee.identityImage = {
        public_id: req.files.identity_image[0].filename,
        url: req.files.identity_image[0].path,
      };

    }

    await employee.save();

    const response = employee.toObject();

    delete response.password;

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully.",
      data: response,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update employee.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });

  }
};

// GET SINGLE EMPLOYEE
exports.getEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID.",
      });
    }

    const employee = await Employee.findById(id)
      .select("-password")
      .lean();

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    // Normalize Response
    const data = {
      _id: employee._id,

      firstName: employee.firstName,
      lastName: employee.lastName,
      name: `${employee.firstName} ${employee.lastName}`.trim(),

      email: employee.email,
      phone: employee.phone,
      address: employee.address,

      role: employee.role,
      status: employee.status,

      identityType: employee.identityType,
      identityNumber: employee.identityNumber,

      employeeImage: employee.employeeImage,
      identityImage: employee.identityImage,

      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };

    return res.status(200).json({
      success: true,
      message: "Employee fetched successfully.",
      data,
    });

  } catch (error) {
    console.error("Get Employee Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching employee.",
    });
  }
};

// DELETE EMPLOYEE (SOFT DELETE)
exports.deleteEmployee = async (req, res) => {
  try {

    const { id } = req.params;

    const employee = await Employee.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    // ==========================
    // Delete Cloudinary Images
    // ==========================

    if (employee.employeeImage?.public_id) {
      await deleteCloudinaryFile(employee.employeeImage.public_id);
    }

    if (employee.identityImage?.public_id) {
      await deleteCloudinaryFile(employee.identityImage.public_id);
    }

    // ==========================
    // Soft Delete
    // ==========================

    employee.isDeleted = true;

    employee.status = "inactive";

    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully.",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete employee.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });

  }
};

// UPDATE EMPLOYEE STATUS
exports.updateStatus = async (req, res) => {

  try {

    const { id } = req.params;

    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {

      return res.status(400).json({
        success: false,
        message: "Invalid status.",
      });

    }

    const employee = await Employee.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!employee) {

      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });

    }

    employee.status = status;

    await employee.save();

    return res.status(200).json({

      success: true,

      message: "Status updated successfully.",

      data: employee,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Failed to update status.",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,

    });

  }

};