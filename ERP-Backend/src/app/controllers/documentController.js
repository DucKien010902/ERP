const fs = require('fs');
const path = require('path');
const Folder = require('../model/document/folder');
const File = require('../model/document/file');
const getFoldersFromDisk = (parentPath = 'E:/LOCAL STORE') => {
  const folderData = [];
  const files = fs.readdirSync(parentPath);
  files.forEach((file) => {
    const currentPath = path.join(parentPath, file);
    const stats = fs.statSync(currentPath);

    if (stats.isDirectory()) {
      const folder = {
        name: file,
        path: currentPath,
        children: getFoldersFromDisk(currentPath), // Đệ quy lấy thư mục con
        isFile: false,
      };
      folderData.push(folder);
    } else if (stats.isFile()) {
      const fileInfo = {
        name: file,
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
      // Lấy dữ liệu thư mục từ ổ đĩa
      const foldersFromDisk = getFoldersFromDisk();

      const convertToFileUrl = (filePath) => {
        const fileName = path.relative(FILES_DIRECTORY, filePath);
        return `/files/${fileName}`;
      };

      const processFilesAndFolders = (items) => {
        return items.map((item) => {
          if (item.isFile) {
            item.url = convertToFileUrl(item.path);
          }
          if (item.children) {
            item.children = processFilesAndFolders(item.children);
          }
          return item;
        });
      };

      // Đệ quy để lưu lại cấu trúc thư mục và tệp vào MongoDB
      const saveDataRecursively = async (dataList, parentId = null) => {
        for (let data of dataList) {
          if (data.isFile) {
            // Lưu tệp vào MongoDB
            const file = new File({
              name: data.name,
              path: data.path,
              size: data.size,
            });
            await file.save();
          } else {
            // Lưu thư mục vào MongoDB
            const folderDoc = new Folder({
              name: data.name,
              path: data.path,
              parentId: parentId,
              children: [],
            });
            await folderDoc.save();

            // Lưu các thư mục con
            if (data.children && data.children.length > 0) {
              await saveDataRecursively(data.children, folderDoc._id);
            }
          }
        }
      };

      // Bước 1: Xóa tất cả cấu trúc thư mục và tệp cũ trong DB
      await File.deleteMany({}); // Xóa tất cả các tệp
      await Folder.deleteMany({}); // Xóa tất cả các thư mục

      // Bước 2: Lưu cấu trúc mới
      await saveDataRecursively(foldersFromDisk);

      // Trả về dữ liệu cấu trúc mới
      res.json(foldersFromDisk);
    } catch (err) {
      res
        .status(500)
        .send({ message: 'Lỗi khi lấy thư mục từ ổ đĩa', error: err });
    }
  }

  async makeNewFolder(req, res) {
    const { parentId, name } = req.body;
    const parentFolder = parentId ? await Folder.findById(parentId) : null;

    const folderPath = parentFolder
      ? `${parentFolder.path}/${name}`
      : `E:/LOCAL STORE${name}`;
    const folder = new Folder({
      name,
      parentId: parentFolder ? parentFolder._id : null,
      path: folderPath,
    });

    try {
      const newFolder = await folder.save();

      if (parentFolder) {
        parentFolder.children.push(newFolder._id);
        await parentFolder.save();
      }

      res.json(newFolder);
    } catch (err) {
      res.status(500).send({ message: 'Lỗi khi tạo thư mục', error: err });
    }
  }
  //   async addFile(req, res) {
  //     const { folderId, name, path, size } = req.body;
  //     const file = new File({ folderId, name, path, size });

  //     try {
  //       const newFile = await file.save();
  //       res.json(newFile);
  //     } catch (err) {
  //       res.status(500).send({ message: 'Lỗi khi thêm tệp', error: err });
  //     }
  //   }
}
module.exports = new Document();
