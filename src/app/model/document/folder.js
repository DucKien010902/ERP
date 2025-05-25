const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Mô hình thư mục (folder)
const folderSchema = new Schema({
  name: { type: String, required: true },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null,
  }, // ID của thư mục cha
  path: { type: String, required: true }, // Đường dẫn tuyệt đối của thư mục
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }], // Các thư mục con
});

const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder;
