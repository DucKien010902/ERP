const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const users = new Schema({
  email: String,
  password: String,
  role: String,
  creatAt: Date,
});
users.pre('save', async function (next) {
  const Employee = mongoose.model('employees'); // Lấy model Employee
  await Employee.create({
    email: this.email,
    fullName: '',
    employee_id: '',
    phoneNumber: '',
    address: '',
    field: '',
    salary: '',
  });
  next();
});
module.exports = mongoose.model('users', users);
