const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const directory = new Schema({
  directoryID: { type: String },
  groupName: String,
  members: [
    {
      userEmail: String,
      userName: String,
      role: String,
    },
  ],
});

module.exports = mongoose.model('directory', directory);
