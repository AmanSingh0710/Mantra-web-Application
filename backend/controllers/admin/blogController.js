const Blog = require("../../models/Blog");
const slugify = require("slugify");

// CREATE BLOG
exports.createBlog = async (req, res) => {
  try {
    const { title, description, content } = req.body;

    const blog = new Blog({
      title,
      description,
      content,
      image: req.file ? req.file.path : "",
      slug: slugify(title, { lower: true })
    });

    await blog.save();

    res.status(201).json({ message: "Blog created", blog });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// GET ALL BLOGS (Public)
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "active" })
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

// GET SINGLE BLOG
exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

// UPDATE BLOG
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Blog.findByIdAndUpdate(
      id,
      {
        ...req.body,
        image: req.file ? req.file.path : undefined
      },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

// DELETE BLOG
exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};