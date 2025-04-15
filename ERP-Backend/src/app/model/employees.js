const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const employees = new Schema({
  email: String,
  fullName: String,
  employee_id: String,
  phoneNumber: String,
  address: String,
  field: String,
  salary: Number,
});

module.exports = mongoose.model('employees', employees);
