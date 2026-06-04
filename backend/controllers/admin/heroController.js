// ================= controllers/heroController.js =================

const fs = require("fs");
const path = require("path");

const Hero = require("../../models/Hero");

// ================= CREATE HERO =================
exports.createHero = async (req, res) => {
  console.log("Request hit createHero"); // LOG 1
  try {
    console.log("File received:", req.file); // LOG 2
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Hero image is required" });
    }

    const { title, subtitle, buttonText, buttonLink, position } = req.body;
    console.log("Body received:", req.body); // LOG 3

    const hero = await Hero.create({
      position,
      image: req.file.filename,
    });

    console.log("Hero created in DB"); // LOG 4
    return res.status(201).json({
      success: true,
      message: "Hero banner created successfully",
      hero,
    });
  } catch (error) {
    console.error("Backend Error:", error); // LOG ERROR
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// ================= GET HEROES =================
exports.getHeroes = async (req, res) => {
  try {
    const heroes = await Hero.find({
      isActive: true,
    }).sort({
      position: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: heroes.length,
      heroes,
    });
  } catch (error) {
    console.log("Get Heroes Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ================= GET SINGLE HERO =================
exports.getSingleHero = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero banner not found",
      });
    }

    return res.status(200).json({
      success: true,
      hero,
    });
  } catch (error) {
    console.log("Get Single Hero Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ================= UPDATE HERO =================
exports.updateHero = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero banner not found",
      });
    }

    const updateData = {
      position: req.body.position,
      isActive: req.body.isActive,
    };

    // New image upload
    if (req.file) {
      const oldImagePath = path.join(
        __dirname,
        "../uploads",
        hero.image
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      updateData.image = req.file.filename;
    }

    const updatedHero = await Hero.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Hero banner updated successfully",
      hero: updatedHero,
    });
  } catch (error) {
    console.log("Update Hero Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ================= DELETE HERO =================
exports.deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero banner not found",
      });
    }

    // Delete image from uploads folder
    const imagePath = path.join(
      __dirname,
      "../uploads",
      hero.image
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Hero.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Hero banner deleted successfully",
    });
  } catch (error) {
    console.log("Delete Hero Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};