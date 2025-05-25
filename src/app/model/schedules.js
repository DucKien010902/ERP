const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schedules = new Schema({
  email: String,
  tasks: [
    {
      task: String,
      startTime: Date,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});
module.exports = mongoose.model('schedules', schedules);
