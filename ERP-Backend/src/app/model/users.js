const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const users = new Schema({
  email: String,
  password: String,
  role: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tự động tạo employee sau khi tạo user
users.post('save', async function (doc, next) {
  const Employee = mongoose.model('employees');
  // Kiểm tra nếu chưa có employee tương ứng thì tạo
  const existing = await Employee.findOne({ email: doc.email });
  if (!existing) {
    await Employee.create({
      email: doc.email,
      fullName: '',
      position: '',
      phoneNumber: '',
      address: '',
      gender: '',
      departments: '',
      salary: '',
    });
  }
  next();
});

// Tự động xóa employee khi xóa user
users.post('findOneAndDelete', async function (doc, next) {
  if (doc) {
    const Employee = mongoose.model('employees');
    await Employee.deleteOne({ email: doc.email });
  }
  next();
});

module.exports = mongoose.model('users', users);
