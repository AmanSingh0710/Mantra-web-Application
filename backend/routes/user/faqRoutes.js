const express = require("express");
const router = express.Router();
const { getFaqs, createFaq, addQuestionToCategory, deleteFaqCategory } = require("../../controllers/user/faqController");

// Public Route
router.get("/", getFaqs);

// Admin Routes (You can add Auth Middleware here later)
router.post("/", createFaq);
router.patch("/:id", addQuestionToCategory);
router.delete("/:id", deleteFaqCategory);

module.exports = router;