const Faq = require("../../models/Faq");

// @desc    Get all FAQ categories
// @route   GET /api/faqs
// @access  Public
const getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({}).sort({ createdAt: -1 });
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new FAQ category
// @route   POST /api/faqs
// @access  Admin
const createFaq = async (req, res) => {
  try {
    const { category, icon, questions } = req.body;

    const faq = await Faq.create({
      category,
      icon,
      questions,
    });

    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a question to an existing category
// @route   PATCH /api/faqs/:id
// @access  Admin
const addQuestionToCategory = async (req, res) => {
  try {
    const { q, a } = req.body;

    const updatedFaq = await Faq.findByIdAndUpdate(
      req.params.id,
      { $push: { questions: { q, a } } },
      { new: true }
    );

    if (!updatedFaq) {
      return res.status(404).json({ message: "FAQ category not found" });
    }

    res.status(200).json(updatedFaq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an FAQ category
// @route   DELETE /api/faqs/:id
// @access  Admin
const deleteFaqCategory = async (req, res) => {
  try {
    const deleted = await Faq.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "FAQ category not found" });
    }

    res.status(200).json({ message: "FAQ category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFaqs,
  createFaq,
  addQuestionToCategory,
  deleteFaqCategory,
};
