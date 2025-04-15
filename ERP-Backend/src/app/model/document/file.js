const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fileSchema = new Schema({
  name: { type: String, required: true },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }, // ID của thư mục chứa tệp
  path: { type: String, required: true }, // Đường dẫn tuyệt đối của tệp
  size: { type: Number, required: true }, // Kích thước tệp
  createdAt: { type: Date, default: Date.now },
});

const File = mongoose.model('File', fileSchema);
module.exports = File;
