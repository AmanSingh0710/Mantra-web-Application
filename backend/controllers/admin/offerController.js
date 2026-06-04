const Offer = require("../../models/Offer");

exports.getActiveOffers = async (req, res) => {
  try {
    const now = new Date();

    const offers = await Offer.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching offers" });
  }
};


/* =========================
   1️⃣ CREATE OFFER
========================= */
exports.createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body);

    res.status(201).json({
      success: true,
      message: "Offer created successfully",
      data: offer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating offer",
    });
  }
};

/* =========================
   2️⃣ GET ALL OFFERS
========================= */
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find()
      .populate("product", "name price")
      .populate("store", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching offers",
    });
  }
};

/* =========================
   3️⃣ GET SINGLE OFFER
========================= */
exports.getSingleOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate("product", "name price")
      .populate("store", "name");

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching offer",
    });
  }
};

/* =========================
   4️⃣ UPDATE OFFER
========================= */
exports.updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      data: offer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating offer",
    });
  }
};

/* =========================
   5️⃣ DELETE OFFER
========================= */
exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting offer",
    });
  }
};

