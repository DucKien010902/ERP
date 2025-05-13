const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const employees = new Schema({
  email: String,
  role: String,
  password: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  fullName: String,
  position: String,
  phoneNumber: String,
  address: String,
  gender: String,
  departments: String,
  salary: Number,
  university: String,
  comefrom: String,
  relation: String,
  company: String,
  highschool: String,
  birthday: String,
  family: String,
  bio: String,
  national: String,
  action: [''],
  avatarImage: String,
  coverImage: String,
});

module.exports = mongoose.model('employees', employees);
