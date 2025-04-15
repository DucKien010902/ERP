const employees = require('../model/employees');
class EmployeeController {
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
      return res
        .status(200)
        .json(allEmployees.filter((employee) => employee.email != email));
    } catch (error) {
      return res.status(500).json({ message: 'Loi he thong' });
    }
  }
}
module.exports = new EmployeeController();
