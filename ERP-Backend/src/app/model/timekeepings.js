const mongoose = require('mongoose');
const { Types } = require('mysql2');

const Schema = mongoose.Schema;

const timekeepings = new Schema({
  email: String,
  works: [
    {
      date: String,
      isCheckin: Boolean,
      timeCheckin: String,
      isCheckout: String,
      timeCheckout: String,
      isFinish: Boolean,
    },
  ],
});
module.exports = mongoose.model('timekeepings', timekeepings);
