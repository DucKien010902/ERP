const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customers = new Schema({
  email: String,
  role: String,
  password: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  fullName: String,
  phoneNumber: String,
  address: String,
  gender: String,
  departments: String,
  comefrom: String,
  birthday: String,
  family: String,
  bio: String,
  national: String,
  avatarImage: String,
});

module.exports = mongoose.model('customers', customers);
