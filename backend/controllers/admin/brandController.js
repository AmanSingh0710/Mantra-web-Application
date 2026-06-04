const Brand = require("../../models/Brand");

// 1. CREATE - Naya Brand Add Karein
exports.createBrand = async (req, res) => {
  try {
    const { name, image } = req.body;
    
    // Check agar brand pehle se hai (Case-insensitive check behtar rehta hai)
    const exists = await Brand.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (exists) return res.status(400).json({ message: "Brand name already exists" });

    // Initial status default true rahegi model ke hisab se
    const brand = await Brand.create({ 
        name, 
        image,
        status: true,
        totalProducts: 0, // Shuruat mein 0
        totalOrders: 0    // Shuruat mein 0
    });
    
    res.status(201).json(brand);
  } catch (err) {
    res.status(500).json({ message: "Error creating brand", error: err.message });
  }
};

// 2. READ - Saare Brands Get Karein
exports.getBrands = async (req, res) => {
  try {
    // Newest brands pehle dikhane ke liye sort
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: "Error fetching brands", error: err.message });
  }
};

// 3. UPDATE - Brand Ki Details Edit Karein (Name & Logo)
exports.updateBrand = async (req, res) => {
  try {
    const { name, image } = req.body;
    
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name, image },
      { new: true, runValidators: true }
    );
    
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// 4. UPDATE STATUS - Switch toggle ke liye alag function
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body; // Frontend se true/false aayega
        const brand = await Brand.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!brand) return res.status(404).json({ message: "Brand not found" });
        res.json({ message: "Status updated", brand });
    } catch (err) {
        res.status(500).json({ message: "Status update failed" });
    }
};

// 5. DELETE - Brand Remove Karein
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    
    await brand.deleteOne();
    res.json({ message: "Brand deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};