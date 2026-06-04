const Employee = require("../../models/Employee");
const Deliveryman = require("../../models/Deliveryman/DeliveryMan");
const bcrypt = require("bcrypt");

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
      identityNumber
    } = req.body;

    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Handling multiple files from multer (upload.fields)
    const employeeImagePath = req.files?.employee_image?.[0]?.filename || "";
    const identityImagePath = req.files?.identity_image?.[0]?.filename || "";

    const employee = new Employee({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
      identityType,
      identityNumber,
      employeeImage: employeeImagePath,
      identityImage: identityImagePath
    });

    await employee.save();

    res.status(201).json({ message: "Employee created successfully ✅", employee });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: "Error creating employee", error: error.message });
  }
};

// GET ALL EMPLOYEES
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees" });
  }
};

// UPDATE EMPLOYEE
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.body.password) {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    // Handle Image Updates if new files are uploaded
    if (req.files) {
      if (req.files['employee_image']) {
        updateData.employeeImage = req.files['employee_image'][0].filename;
      }
      if (req.files['identity_image']) {
        updateData.identityImage = req.files['identity_image'][0].filename;
      }
    }

    const updated = await Employee.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true // Ensures enum values are checked
    }).select("-password");

    res.status(200).json({ message: "Updated successfully", updated });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// DELETE, GET SINGLE, and STATUS remain mostly same, just ensure they use the correct Model
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select("-password");
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select("-password");
    const deliverymen = await Deliveryman.find().select("-password"); // Add this

    // Combine both arrays into one list
    const allStaff = [...employees, ...deliverymen];
    
    res.status(200).json(allStaff);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff" });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Status update failed" });
  }
};