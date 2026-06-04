const Banner = require("../../models/Banner");
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// Helper: Build full image URL
const buildImageUrl = (filename) => {
  if (!filename) return null;
  return `${BASE_URL}/uploads/${filename}`;
};

// Helper: Validate link (prevent base64 misuse)
const isValidLink = (link) => {
  if (!link) return true;
  return !link.startsWith("data:");
};

// CREATE BANNER
exports.createBanner = async (req, res) => {
  try {
    const { bannerType, link, published } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!isValidLink(link)) {
      return res.status(400).json({ message: "Invalid link format" });
    }

    const banner = await Banner.create({
      bannerType,
      link: link || "#",
      published: published === "true" || published === true,
      image: req.file.filename,
    });

    const response = {
      ...banner._doc,
      image: buildImageUrl(banner.image),
    };

    res.status(201).json(response);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET ALL BANNERS
exports.getBanners = async (req, res) => {
  try {
    const { search, bannerType, status } = req.query;
    let query = {};

    if (bannerType) query.bannerType = bannerType;
    if (status) query.published = status === "true";

    if (search) {
      query.bannerType = { $regex: search, $options: "i" };
    }

    const banners = await Banner.find(query).sort({ createdAt: -1 });

    const formatted = banners.map((banner) => ({
      ...banner._doc,
      image: buildImageUrl(banner.image),
      link: isValidLink(banner.link) ? banner.link : "#",
    }));

    res.status(200).json(formatted);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// TOGGLE STATUS
exports.toggleBannerStatus = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    banner.published = !banner.published;
    await banner.save();

    res.status(200).json({
      ...banner._doc,
      image: buildImageUrl(banner.image),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// DELETE BANNER
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Delete image safely
    if (banner.image) {
      const imagePath = path.join(__dirname, "../uploads", banner.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await banner.deleteOne();

    res.status(200).json({ message: "Banner deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// UPDATE BANNER
exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    const { bannerType, link, published } = req.body;

    if (link && !isValidLink(link)) {
      return res.status(400).json({ message: "Invalid link format" });
    }

    banner.bannerType = bannerType || banner.bannerType;
    banner.link = link || banner.link;
    banner.published = published === "true" || published === true;

    if (req.file) {
      // delete old image
      if (banner.image) {
        const oldPath = path.join(__dirname, "../uploads", banner.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      banner.image = req.file.filename;
    }

    await banner.save();

    res.status(200).json({
      ...banner._doc,
      image: buildImageUrl(banner.image),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};