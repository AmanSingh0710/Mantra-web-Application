const Attribute = require("../../models/Attribute");

// 1. Get all attributes (with search functionality)
exports.getAttributes = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    // Agar user search box mein kuch type karega
    if (search) {
      filter.name = { $regex: search, $options: "i" }; // 'i' means case-insensitive
    }

    const attributes = await Attribute.find(filter).sort({ createdAt: -1 });
    res.status(200).json(attributes);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 2. Create a new attribute
exports.createAttribute = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Attribute name is required" });
    }

    const newAttribute = new Attribute({ name });
    await newAttribute.save();
    res.status(201).json(newAttribute);
  } catch (error) {
    res.status(500).json({ message: "Error saving attribute", error: error.message });
  }
};

// 3. Update an attribute (Edit functionality)
exports.updateAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedAttr = await Attribute.findByIdAndUpdate(
      id,
      { name },
      { new: true } // updated data return karega
    );

    if (!updatedAttr) return res.status(404).json({ message: "Not found" });
    res.status(200).json(updatedAttr);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// 4. Delete an attribute
exports.deleteAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Attribute.findByIdAndDelete(id);
    
    if (!deleted) return res.status(404).json({ message: "Attribute not found" });
    res.status(200).json({ message: "Attribute deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};