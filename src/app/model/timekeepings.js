const mongoose = require('mongoose');

const checkIn = new mongoose.Schema({
  userEmail: { type: String, required: true },
  // userName: { type: String }, // Optional: nếu cần show tên
  date: { type: String, required: true }, // format: DD/MM/YYYY
  time: { type: String, required: true }, // format: HH:mm:ss
  status: {
    type: String,
    enum: ['✅ Thành công', '❌ Xa khu vực'],
    required: true,
  },
});

module.exports = mongoose.model('CheckIn', checkIn);
