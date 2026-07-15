// ================= controllers/heroController.js =================

const fs = require("fs");
const path = require("path");
const { cloudinary, deleteCloudinaryFile } = require("../../utils/cloudinary");

const Hero = require("../../models/Hero");

// ================= CREATE HERO =================
exports.createHero = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Hero image required"
      });
    }

    const hero = await Hero.create({
      position: Number(req.body.position || 0),

      image: {
        publicId: req.file.filename,
        url: req.file.path
      }
    });

    return res.status(201).json({
      success: true,
      hero
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
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
        message: "Hero not found"
      });
    }

    const updateData = {
      position: req.body.position,
      isActive: req.body.isActive
    };

    if (req.file) {

      if (hero.image?.publicId) {
        await deleteCloudinaryFile(hero.image.publicId);
      }

      updateData.image = {
        publicId: req.file.filename,
        url: req.file.path
      };
    }

    const updatedHero = await Hero.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      success: true,
      hero: updatedHero
    });
  }
  catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }

}


// ================= DELETE HERO =================
exports.deleteHero = async (req, res) => {
  try {

    const hero = await Hero.findById(req.params.id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero not found"
      });
    }

    if (hero.image?.publicId) {

      await deleteCloudinaryFile(hero.image.publicId);

    }

    await Hero.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Deleted successfully"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};