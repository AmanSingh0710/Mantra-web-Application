const express = require('express');
const router = express.Router();
const refundController = require('../../controllers/admin/refundController');
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");

// 1. Create
router.post('/add', auth, isAdmin("ADMIN"), refundController.createRefund);

// 2. Read (All, Status filter, Search)
router.get('/', auth, isAdmin("ADMIN"), refundController.getAllRefunds);

// 3. Update (Status change or Edit)
router.patch('/:id', auth, isAdmin("ADMIN"), refundController.updateRefund);

// 4. Delete
router.delete('/:id', auth, isAdmin("ADMIN"), refundController.deleteRefund);

module.exports = router;