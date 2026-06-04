const express = require("express");
const router = express.Router();
const Visitor = require("../../controllers/admin/visitorController");

router.post("/track", Visitor.trackVisitor);
router.get("/stats", Visitor.getStats);

module.exports = router;