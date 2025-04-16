const users = require('../model/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.DB_SECRETKEY;
class AuthController {
  async check(req, res) {
    const { email, password, role } = req.body; // Lấy email và password từ body
    const userAgent = req.headers['user-agent'];
    if (userAgent && userAgent.includes('PostmanRuntime')) {
      return res
        .status(403)
        .json({ message: 'Không được phép đăng nhập từ Postman!' });
    }
    // Kiểm tra nếu thiếu thông tin
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }
    const existingUser = await users.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: 'Not found account' });
    }
    console.log(existingUser.role);
    if (password == existingUser.password && role == existingUser.role) {
      const token = jwt.sign({ email: existingUser.email }, SECRET_KEY, {
        expiresIn: '1h',
      });
      return res.status(200).json({ message: 'Account found', token });
    } else {
      if (password != existingUser.password) {
        return res.status(404).json({ message: 'Invalid password' });
      } else {
        return res.status(404).json({ message: 'Not correct role' });
      }
    }
    // Tìm người dùng trong cơ sở dữ liệu theo email
  }
  creat = async (req, res) => {
    try {
      const { email, password, role } = req.body;
      console.log(email);
      // Kiểm tra email đã tồn tại chưa
      const existingUser = await users.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email đã tồn tại' });
      }

      // Nếu chưa có, tạo user mới
      const newUser = new users({
        email,
        password,
        role,
        creatAt: Date.now(),
      });
      await newUser.save();

      return res.status(200).json({ message: 'Tạo tài khoản thành công' });
    } catch (err) {
      console.log('khong add duoc');
      return res.status(500).send('Lỗi hệ thống');
    }
  };
  profile(req, res) {
    const email = req.query.email;
    getUserByEmail(email, (err, foundUser) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      } else {
        return res.status(200).json(foundUser[0]);
      }
    });
  }
  card(req, res) {
    getAllcards((err, cards) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      } else {
        return res.status(200).json(cards);
      }
    });
  }
}
module.exports = new AuthController();
