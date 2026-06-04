const { Ticket, Message } = require("../../../models/Help&Support/Support");

// --- PAGE 1: INBOX (List of all active conversations) ---
exports.getInbox = async (req, res) => {
  try {
    // Finds the latest message for every ticket to show in a "WhatsApp-style" list
    const inbox = await Message.find()
      .populate({ path: 'ticket', populate: { path: 'user', select: 'name email image' } })
      .sort({ createdAt: -1 });
      
    // Filter to show only unique tickets (latest message per ticket)
    const uniqueInbox = [...new Map(inbox.map(m => [m.ticket._id.toString(), m])).values()];
    res.status(200).json(uniqueInbox);
  } catch (error) {
    res.status(500).json({ message: "Inbox error" });
  }
};

// --- PAGE 2: MESSAGES (The actual chat history for one ticket) ---
exports.getChatHistory = async (req, res) => {
  try {
    const messages = await Message.find({ ticket: req.params.ticketId })
      .populate("sender", "name firstName lastName employeeImage image")
      .sort({ createdAt: 1 }); // Oldest to newest for chat
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Chat error" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const newMessage = new Message({
      ticket: req.body.ticketId,
      sender: req.user.id,
      onModel: 'Employee', // Admin/Staff side
      text: req.body.text
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
};

// --- PAGE 3: SUPPORT TICKETS (Full CRUD for Ticket Management) ---
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("user", "name email").sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Tickets error" });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const updated = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    await Message.deleteMany({ ticket: req.params.id }); // Clean up messages too
    res.status(200).json({ message: "Ticket and history deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};