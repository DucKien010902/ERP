const schedules = require('../model/schedules');
const Schedule = require('../model/schedules');

class Schedules {
  async setSchedule(req, res) {
    try {
      const { email, task, startTime } = req.body;
      let userSchedule = await Schedule.findOne({ email });
      if (!userSchedule) {
        userSchedule = new Schedule({
          email: email,
          tasks: [],
        });
      }
      const isDuplicate = userSchedule.tasks.some(
        (schedule) =>
          new Date(schedule.startTime).getTime() ===
          new Date(startTime).getTime()
      );

      if (isDuplicate) {
        return res.status(400).json({ error: 'Lịch trình này đã tồn tại!' });
      }

      userSchedule.tasks.push({
        task: task,
        startTime: startTime,
        createdAt: Date.now(),
      });

      await userSchedule.save();
      const updatedSchedules = await Schedule.findOne({ email }).lean();
      updatedSchedules.tasks.sort(
        (a, b) => new Date(a.startTime) - new Date(b.startTime)
      );

      res.status(201).json({
        message: 'Lịch trình đã được lưu!',
      });
    } catch (error) {
      console.error('Lỗi khi lưu lịch trình:', error);
      res.status(500).json({ error: 'Lỗi khi lưu lịch trình!' });
    }
  }
  async getSchedule(req, res) {
    try {
      const { email } = req.query;
      const updatedSchedules = await Schedule.findOne({ email }).lean();
      updatedSchedules.tasks.sort(
        (a, b) => new Date(a.startTime) - new Date(b.startTime)
      );

      const schedules = updatedSchedules.tasks;
      res.status(200).json(schedules);
    } catch (error) {
      res.status(500).json({ error: 'Lỗi khi lấy lịch trình!' });
    }
  }
}

module.exports = new Schedules();
