const fs = require('fs');
const path = require('path');
const Folder = require('../model/document/folder');
const File = require('../model/document/file');
const BASE_DIR =
  'C:/Users/Admin/OneDrive - Hanoi University of Science and Technology/Desktop/HOC TAP/ERP';
const getFoldersFromDisk = (parentPath = BASE_DIR) => {
  const folderData = [];
  const files = fs.readdirSync(parentPath);
  files.forEach((file) => {
    const currentPath = path.join(parentPath, file);
    const stats = fs.statSync(currentPath);

    if (stats.isDirectory()) {
      const folder = {
        folderName: file,
        path: currentPath,
        children: getFoldersFromDisk(currentPath), // Đệ quy lấy thư mục con
        isFile: false,
      };
      folderData.push(folder);
    } else if (stats.isFile()) {
      const fileInfo = {
        folderName: file,
        path: currentPath,
        size: stats.size,
        isFile: true,
      };
      folderData.push(fileInfo);
    }
  });

  return folderData;
};
class Document {
  async getAllDocument(req, res) {
    try {
      const { parentPath = BASE_DIR } = req.query; // Nhận tham số parentPath từ query nếu có

      const getFoldersFromDisk = (parentPath) => {
        const folderData = [];
        const files = fs.readdirSync(parentPath);
        files.forEach((file) => {
          const currentPath = path.join(parentPath, file);
          const stats = fs.statSync(currentPath);

          if (stats.isDirectory()) {
            const folder = {
              folderName: file,
              path: currentPath,
              isFile: false,
              children: [], // Chỉ trả về children khi người dùng mở thư mục
            };
            folderData.push(folder);
          } else if (stats.isFile()) {
            const fileInfo = {
              folderName: file,
              path: currentPath,
              size: stats.size,
              isFile: true,
            };
            folderData.push(fileInfo);
          }
        });
        return folderData;
      };

      const folderData = getFoldersFromDisk(parentPath); // Chỉ lấy thư mục cấp 1

      res.json(folderData); // Trả về dữ liệu cấu trúc thư mục
    } catch (err) {
      res
        .status(500)
        .send({ message: 'Lỗi khi lấy thư mục từ ổ đĩa', error: err });
    }
  }

  async getFolderChildren(req, res) {
    try {
      const { parentPath } = req.query; // Nhận tham số parentPath từ query để lấy các thư mục con

      if (!parentPath) {
        return res.status(400).json({ error: 'parentPath is required' });
      }

      const getFoldersFromDisk = (parentPath) => {
        const folderData = [];
        const files = fs.readdirSync(parentPath);
        files.forEach((file) => {
          const currentPath = path.join(parentPath, file);
          const stats = fs.statSync(currentPath);

          if (stats.isDirectory()) {
            const folder = {
              folderName: file,
              path: currentPath,
              isFile: false,
              children: [], // Chỉ trả về children khi người dùng mở thư mục
            };
            folderData.push(folder);
          } else if (stats.isFile()) {
            const fileInfo = {
              folderName: file,
              path: currentPath,
              size: stats.size,
              isFile: true,
            };
            folderData.push(fileInfo);
          }
        });
        return folderData;
      };

      const folderData = getFoldersFromDisk(parentPath); // Lấy các thư mục con của thư mục cha

      res.json(folderData); // Trả về các thư mục con
    } catch (err) {
      res.status(500).send({ message: 'Lỗi khi lấy thư mục con', error: err });
    }
  }

  async resolveUrl(req, res) {
    const relativePath = req.query.path;
    const fullPath = path.join(BASE_DIR, relativePath);

    if (!fullPath.endsWith('.url')) {
      return res.status(400).json({ error: 'Not a .url file' });
    }

    fs.readFile(fullPath, 'utf8', (err, data) => {
      if (err) return res.status(500).json({ error: 'Cannot read file' });
      const match = data.match(/URL=(.+)/);
      const realUrl = match ? match[1].trim() : null;
      if (realUrl) {
        res.json({ realUrl });
      } else {
        res.status(404).json({ error: 'URL not found in .url file' });
      }
    });
  }
  async makeNewFolder(req, res) {
    const { parentPath, folderName } = req.body;

    try {
      const folderPath = parentPath
        ? path.join(parentPath, folderName)
        : path.join(BASE_DIR, folderName);

      // Tạo thư mục trên ổ đĩa nếu chưa tồn tại
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        return res.json({
          message: 'Tạo thư mục thành công',
          path: folderPath,
        });
      } else {
        return res.status(400).json({ message: 'Thư mục đã tồn tại' });
      }
    } catch (err) {
      res.status(500).send({ message: 'Lỗi khi tạo thư mục', error: err });
    }
  }
}
module.exports = new Document();
