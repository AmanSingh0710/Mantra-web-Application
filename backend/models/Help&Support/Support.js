const mongoose = require("mongoose");

// --- TICKET MODEL (For "Support Tickets" Page) ---
const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true, default: () => "TIC-" + Date.now().toString().slice(-6) },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['Order', 'Refund', 'Technical', 'General'], default: 'General' },
  status: { type: String, enum: ['Pending', 'Open', 'Resolved', 'Closed'], default: 'Pending' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Low' },
}, { timestamps: true });

// --- MESSAGE MODEL (For "Inbox" and "Messages" Page) ---
const messageSchema = new mongoose.Schema({
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, refPath: 'onModel', required: true },
  onModel: { type: String, required: true, enum: ['User', 'Employee'] },
  text: { type: String, required: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

const Ticket = mongoose.model("Ticket", ticketSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = { Ticket, Message };