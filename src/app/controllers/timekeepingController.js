const checkIn = require('../model/timekeepings');
class CheckInController {
  async addCheckData(req, res) {
    try {
      const { timeStr, dateStr, status, email } = req.body;
      console.log(timeStr, dateStr, status, email);
      const newData = new checkIn({
        time: timeStr,
        date: dateStr,
        status,
        userEmail: email,
      });
      await newData.save();
      return res.status(200).json({ message: 'Luu thanh cong' });
    } catch (error) {
      return res.status(500).json({ message: 'Luu that bai' });
    }
  }
  async getallCheckIn(req, res) {
    try {
      const allcheckIn = await checkIn.find({});
      return res.status(200).json(allcheckIn);
    } catch (error) {
      return res.status(500).json({ message: 'Loi server' });
    }
  }
}
module.exports = new CheckInController();
