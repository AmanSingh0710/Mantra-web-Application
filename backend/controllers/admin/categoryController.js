const Category = require("../../models/Category");

exports.getCategories = async (req, res) => {
  try {
    const cats = await Category.find()
      .populate("parent", "name")
      // Level wise sort karega, phir priority (1,2,3...) ke hisab se, phir name se
      .sort({ level: 1, priority: 1, name: 1 }); 

    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPublicCategories = async (req, res) => {
  try {

    const categories = await Category.find({
      level: 1
    })
      .sort({
        priority: 1,
        createdAt: -1
      })
      .select("name image");

    res.status(200).json({
      success: true,
      categories
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load categories"
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, image, parent, priority } = req.body;

    let level = 1;

    if (parent) {
      const parentCategory = await Category.findById(parent);

      if (!parentCategory) {
        return res.status(400).json({ message: "Parent category not found" });
      }

      if (parentCategory.level >= 3) {
        return res.status(400).json({ message: "Maximum 3 levels allowed" });
      }

      level = parentCategory.level + 1;
    }

    const category = await Category.create({
      name,
      description,
      image,
      priority: priority || 0, // save priority
      parent: parent || null,
      level
    });

    res.status(201).json(category);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.updateCategory = async (req, res) => {
  try {
    const { parent } = req.body;

    if (parent) {
      const parentCategory = await Category.findById(parent);

      if (!parentCategory) {
        return res.status(400).json({ message: "Parent category not found" });
      }

      if (parentCategory.level >= 3) {
        return res.status(400).json({ message: "Cannot move beyond 3 levels" });
      }

      req.body.level = parentCategory.level + 1;
    } else {
      req.body.level = 1;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(category);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.deleteCategory = async (req, res) => {
  try {
    const deleteWithChildren = async (categoryId) => {
      const children = await Category.find({ parent: categoryId });

      for (let child of children) {
        await deleteWithChildren(child._id);
      }

      await Category.findByIdAndDelete(categoryId);
    };

    await deleteWithChildren(req.params.id);

    res.json({ message: "Category and subcategories deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
