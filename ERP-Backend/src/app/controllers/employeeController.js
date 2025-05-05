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
    console.log(existingUser.role);
    if (password == existingUser.password && role == existingUser.role) {
      const token = jwt.sign({ email: existingUser.email }, SECRET_KEY, {
        expiresIn: '1h',
      });
      return res
        .status(200)
        .json({
          message: 'Account found',
          token,
          fullName: existingUser.fullName,
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
      const { email, fullName, employee_id, phoneNumber, address, field } =
        req.body;
      console.log(typeof employee_id);
      const existingUser = await employees.findOne({ email });
      if (!existingUser) {
        const newEmployees = new employees({
          email,
          fullName,
          employee_id,
          phoneNumber,
          address,
          field,
        });
        await newEmployees.save();
        return res.status(200).json({ message: 'Tạo nhân viên thành công' });
      } else {
        // console.log(existingUser);
        await employees.updateOne(
          { email },
          {
            $set: {
              // 🎯 Đúng cú pháp cập nhật
              fullName,
              employee_id,
              phoneNumber,
              address,
              field,
            },
          }
        );
        return res
          .status(200)
          .json({ message: 'Cập nhật nhân viên thành công' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Loi he thong' });
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
