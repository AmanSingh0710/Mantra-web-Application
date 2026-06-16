const Blog = require("../../models/Blog");
const {cloudinary, deleteCloudinaryFile} = require("../../utils/cloudinary");
const slugify = require("slugify");


// ======================================================
// CREATE BLOG
// ======================================================
exports.createBlog = async (req, res) => {
  try {
    const { title, description, content, author,  status } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, description and content are required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Blog image is required"
      });
    }

    let slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true
    });

    const existingBlog = await Blog.findOne({ slug });

    if (existingBlog) {
      slug = `${slug}-${Date.now()}`;
    }

    const uploadedImage = await cloudinary.uploader.upload(req.file.path,
      {
        folder: "blogs"
      }
    );

    const blog = await Blog.create({
      title,
      slug,
      description,
      content,
      author: author || "Admin",
      status: status || "active",
      image: uploadedImage.secure_url,
      imagePublicId: uploadedImage.public_id
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog
    });

  } catch (error) {
    console.error("Create Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ======================================================
// GET ALL BLOGS
// ======================================================
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({status: "active"})
      .select(
        "title slug description image author status createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs
    });

  } catch (error) {
    console.error("Get Blogs Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ======================================================
// GET ALL BLOG ADMIN
// ======================================================
exports.getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ======================================================
// GET SINGLE BLOG ADMIN
// ======================================================
exports.getSingleBlogAdmin = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET SINGLE BLOG BY SLUG
// ======================================================
exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: "active"
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    return res.status(200).json({
      success: true,
      blog
    });

  } catch (error) {
    console.error("Get Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ======================================================
// UPDATE BLOG
// ======================================================
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    let image = blog.image;
    let imagePublicId = blog.imagePublicId;

    // New Image Upload
    if (req.file) {

      if (blog.imagePublicId) {
        await cloudinary.uploader.destroy(
          blog.imagePublicId
        );
      }

      const uploadedImage =
        await cloudinary.uploader.upload(
          req.file.path,
          {
            folder: "blogs"
          }
        );

      image = uploadedImage.secure_url;
      imagePublicId = uploadedImage.public_id;
    }

    // Update slug if title changed
    let slug = blog.slug;

    if (
      req.body.title &&
      req.body.title !== blog.title
    ) {
      slug = slugify(req.body.title, {
        lower: true,
        strict: true,
        trim: true
      });
    }

    const updatedBlog =await Blog.findByIdAndUpdate(id,
        {
          ...req.body,
          slug,
          image,
          imagePublicId
        },
        {
          new: true,
          runValidators: true
        }
      );

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog
    });

  } catch (error) {
    console.error("Update Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ======================================================
// DELETE BLOG
// ======================================================
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    if (blog.imagePublicId) {
      await cloudinary.uploader.destroy(
        blog.imagePublicId
      );
    }

    await Blog.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully"
    });

  } catch (error) {
    console.error("Delete Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ======================================================
// TOGGLE BLOG STATUS
// ======================================================
exports.toggleBlogStatus = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    blog.status =
      blog.status === "active"
        ? "inactive"
        : "active";

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog status updated",
      blog
    });

  } catch (error) {
    console.error("Toggle Status Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};