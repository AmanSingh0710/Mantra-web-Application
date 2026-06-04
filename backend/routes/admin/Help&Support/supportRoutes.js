const express = require("express");
const router = express.Router();
const support = require('../../../controllers/admin/Help&Support/supportController');
const auth = require('../../../middleware/auth');
const isAdmin = require('../../../middleware/isAdmin');

// 1. Inbox Route
router.get("/inbox", auth, isAdmin, support.getInbox);

// 2. Messages Routes (Chat)
router.get("/chat/:ticketId", auth, isAdmin, support.getChatHistory);
router.post("/chat/send", auth, support.sendMessage);

// 3. Support Tickets Routes (CRUD)
router.get("/tickets", auth, isAdmin, support.getAllTickets);
router.put("/tickets/:id", auth, isAdmin, support.updateTicket);
router.delete("/tickets/:id", auth, isAdmin, support.deleteTicket);

module.exports = router;