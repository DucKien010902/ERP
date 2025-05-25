const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatDB = new mongoose.Schema({
  chatID: { type: String },
  type: { type: String, enum: ['private', 'group'], required: true }, // Loại chat
  members: [
    {
      userEmail: { type: String },
      userName: String,
    },
  ], // Thành viên trong chat
  groupName: String,
  createdAt: { type: Date, default: Date.now },

  messages: [
    {
      senderEmail: String, // Ai gửi
      senderName: String,
      content: { type: String, require: true }, // Nội dung tin nhắn
      timestamp: { type: Date },
    },
  ],
});

module.exports = mongoose.model('chatDB', chatDB);
