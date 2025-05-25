const mongoose = require('mongoose');

// Cập nhật chuỗi kết nối với mật khẩu và thông tin MongoDB Atlas
async function connect() {
  try {
    await mongoose.connect(
      'mongodb+srv://DucKien:kien010902@cluster0.4l1lzw3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    );
    console.log('success connect');
  } catch (error) {
    console.log('Error connecting to MongoDB Atlas:', error);
  }
}

module.exports = { connect };
