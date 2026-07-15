const Category = require("../../models/Category");
const {cloudinary,deleteCloudinaryFile}  = require("../../utils/cloudinary");
//backend/controllers/admin/categoryController.js
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("parent", "name")
      // Level wise sort karega, phir priority (1,2,3...) ke hisab se, phir name se
      .sort({ level: 1, priority: 1, name: 1 });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
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

    return res.status(200).json({
      success: true,
      categories
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, parent, priority } = req.body;

    let level = 1;

    if (parent) {
      const parentCategory = await Category.findById(parent);

      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: "Parent category not found"
        });
      }

      if (parentCategory.level >= 3) {
        return res.status(400).json({
          success: false,
          message: "Maximum 3 levels allowed"
        });
      }

      level = parentCategory.level + 1;
    }

    let image = {
      publicId: "",
      url: ""
    };

    if (req.file) {
      image = {
        publicId: req.file.filename,
        url: req.file.path
      };
    }

    const category = await Category.create({
      name,
      description,
      image,
      priority: Number(priority) || 0,
      parent: parent || null,
      level
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    const { name, description, parent, priority } = req.body;

    let level = 1;

    if (parent) {
      const parentCategory = await Category.findById(parent);

      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: "Parent category not found"
        });
      }

      if (parentCategory.level >= 3) {
        return res.status(400).json({
          success: false,
          message: "Cannot move beyond 3 levels"
        });
      }

      level = parentCategory.level + 1;
    }

    let image = category.image;

    if (req.file) {

      if (category.image?.publicId) {
        await deleteCloudinaryFile(category.image.publicId);
      }

      category.image = {publicId: req.file.filename,url: req.file.path};
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.priority = Number(priority) || 0;
    category.parent = parent || null;
    category.level = level;
    category.image = image;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


exports.deleteCategory = async (req, res) => {
  try {

    const deleteWithChildren = async (categoryId) => {

      const category = await Category.findById(categoryId);

      if (!category) return;

      const children = await Category.find({parent: categoryId});

      for (const child of children) {
        await deleteWithChildren(child._id);
      }

      // Delete image from Cloudinary
      if (category.image?.publicId) { await deleteCloudinaryFile(category.image.publicId);}

      await Category.findByIdAndDelete(categoryId);
    };

    await deleteWithChildren(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Category and subcategories deleted successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
