const express = require('express');
const router = express.Router();
const subscriberController = require('../../controllers/admin/subscriberController');
const auth  = require("../../middleware/auth");
const isAdmin  = require("../../middleware/isAdmin");

// public routes     // Get list with query filters
router.post('/add', subscriberController.subscribe);
router.put('/unsubscribe', subscriberController.unsubscribe);


//Admin routes
router.get('/', auth ,isAdmin("ADMIN"),subscriberController.getAllSubscribers); 
router.get('/:id', auth, isAdmin, subscriberController.getSubscriberById);
router.delete('/:id', auth ,isAdmin("ADMIN"), subscriberController.deleteSubscriber); 

module.exports = router;