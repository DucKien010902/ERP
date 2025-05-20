const employees = require('../model/employees');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.DB_SECRETKEY;
class EmployeeController {
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
    const existingUser = await employees.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: 'Not found account' });
    }
    if (password == existingUser.password && role == existingUser.role) {
      const token = jwt.sign({ email: existingUser.email }, SECRET_KEY, {
        expiresIn: '1h',
      });
      return res.status(200).json({
        message: 'Account found',
        token,
        userInfo: existingUser,
      });
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
      const existingUser = await employees.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email đã tồn tại' });
      }

      // Nếu chưa có, tạo user mới
      const newUser = new employees({
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
  async updateAccount(req, res) {
    try {
      console.log(req.body);
      const {
        university,
        address,
        comefrom,
        relation,
        phone,
        company,
        highschool,
        birthday,
        gender,
        family,
        bio,
        national,
        action,
        email,
      } = req.body;
      console.log('Toi day roi');
      const existingUser = await employees.findOne({ email });
      if (!existingUser) {
      } else {
        // console.log(existingUser);
        await employees.updateOne(
          { email },
          {
            $set: {
              university,
              address,
              comefrom,
              relation,
              phoneNumber: phone,
              company,
              highschool,
              birthday,
              gender,
              family,
              bio,
              national,
              action,
            },
          }
        );
        return res
          .status(200)
          .json({ message: 'Cập nhật thông tin thành công' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Loi he thong' });
    }
  }
  async updateImage(req, res) {
    try {
      const { email, type, base64 } = req.body;
      console.log(type, ': ', base64);
      const existingUser = await employees.findOne({ email });
      existingUser[type] = base64;
      await existingUser.save();
      return res.status(200).json({ message: 'Cap nhat anh thanh cong' });
    } catch (error) {
      return res.status(500).json({ message: 'Loi server' });
    }
  }
  async getAccount(req, res) {
    try {
      const { email } = req.query;
      const existingUser = await employees.findOne({ email });
      return res.status(200).json(existingUser);
    } catch (error) {
      return res.status(500).json({ message: 'Loi he thong' });
    }
  }
  async getAllAccount(req, res) {
    try {
      const { email } = req.query;
      const allEmployees = await employees.find();
      return res.status(200).json(
        allEmployees.map((item) => ({
          email: item.email,
          role: item.role,
          fullName: item.fullName,
        }))
      );
    } catch (error) {
      return res.status(500).json({ message: 'Loi he thong' });
    }
  }
}
module.exports = new EmployeeController();
