const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    default: 0,
  },
  recipient_user_id: {
    type: mongoose.Schema.ObjectId,
    default: 0,
  },
  room_chat_number: {
    type: Number,
    default: 0,
  },
  message: {
    type: String,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;