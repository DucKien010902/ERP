const { default: mongoose } = require('mongoose');
const DirectoryDB = require('../model/directory');
class Directory {
  async AddDirectory(req, res) {
    try {
      const { directoryName, role, accountList } = req.body;
      const directory = new DirectoryDB({
        directoryID: new mongoose.Types.ObjectId().toString(),
        groupName: directoryName,
        members: [],
      });
      directory.members.push(
        ...accountList.map((item) => ({
          userEmail: item.email,
          role: role,
          userName: item.fullName,
        }))
      );
      await directory.save();
      return res.status(200).json({ message: 'Thêm bộ phận thành công' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi Server' });
    }
  }
  async GetAllDirectory(req, res) {
    try {
      const directory = await DirectoryDB.find();
      return res.status(200).json(directory);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi Server' });
    }
  }
  async DeleteDirectory(req, res) {
    try {
      const { ID } = req.body;
      console.log(ID);
      await DirectoryDB.deleteOne({ directoryID: ID });
      return res.status(200).json({ message: 'Da xoa thanh cong' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi Server' });
    }
  }
  async AddDirectoryMember(req, res) {
    try {
      const { ID, value } = req.body;
      const DB = await DirectoryDB.findOne({ directoryID: ID });
      console.log(value);
      value.forEach((user) => {
        const exists = DB.members.some((m) => m.userEmail === user.email);
        if (!exists) {
          DB.members.push({
            userEmail: user.email,
            userName: user.fullName || '', // tránh undefined nếu không có fullName
            role: user.role || 'Nhân viên', // gán role mặc định nếu cần
          });
        }
      });

      await DB.save();
      return res.status(200).json({ message: 'Them thanh cong' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi Server' });
    }
  }
  async RemoveDirectoryMember(req, res) {
    try {
      const { ID, value } = req.body;
      const DB = await DirectoryDB.findOne({ directoryID: ID });
      console.log(value);

      // Duyệt qua các email trong mảng value và xóa các thành viên trong DB.members
      DB.members = DB.members.filter(
        (m) => !value.some((email) => email === m.userEmail)
      );

      await DB.save();
      return res.status(200).json({ message: 'Xóa thành công' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi Server' });
    }
  }

  async GetDirectoryMember(req, res) {
    try {
      const { ID } = req.body;
      const DB = await DirectoryDB.findOne({ directoryID: ID });
      return res.status(200).json(DB.members);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi Server' });
    }
  }
}
module.exports = new Directory();
