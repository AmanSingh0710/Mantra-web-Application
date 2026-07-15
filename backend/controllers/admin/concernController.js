const Concern = require("../../models/Concern");

// Create Concern
exports.createConcern = async (req, res) => {
  try {
    const { title, categories, priority } = req.body;

    const existingConcern = await Concern.findOne({
      title: title.trim()
    });

    if (existingConcern) {
      return res.status(400).json({
        success: false,
        message: "Concern already exists"
      });
    }

    const concern = await Concern.create({
      title,
      categories,
      priority,
      image: req.file ? req.file.path : ""
    });

    return res.status(201).json({
      success: true,
      message: "Concern created successfully",
      concern
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Concerns (Admin)
exports.getAllConcerns = async (req, res) => {
  try {
    const concerns = await Concern.find()
      .populate("categories", "name")
      .sort({ priority: 1 });

    return res.status(200).json({
      success: true,
      concerns
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Public Concerns (Homepage)
exports.getPublicConcerns = async (req, res) => {
  try {
    const concerns = await Concern.find({
      status: true
    })
      .select("title image priority")
      .sort({ priority: 1 });

    return res.status(200).json({
      success: true,
      concerns
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Single Concern
exports.getSingleConcern = async (req, res) => {
  try {
    const concern = await Concern.findById(req.params.id)
      .populate("categories", "name");

    if (!concern) {
      return res.status(404).json({
        success: false,
        message: "Concern not found"
      });
    }

    return res.status(200).json({
      success: true,
      concern
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Concern
exports.updateConcern = async (req, res) => {
  try {
    const updateData = {
      ...req.body
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const concern = await Concern.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Concern updated successfully",
      concern
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Concern
exports.deleteConcern = async (req, res) => {
  try {
    await Concern.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Concern deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};