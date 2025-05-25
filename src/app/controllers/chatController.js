const mongoose = require('mongoose');
const Chat = require('../model/chatDB');
const employees = require('../model/employees');

class ChatDB {
  async sendmessage(req, res) {
    try {
      const { senderEmail, receiverEmail, content } = req.body;
      if (!senderEmail || !receiverEmail || !content) {
        return res.status(400).json({ message: 'Thiếu thông tin' });
      }

      const sender = await employees.findOne({ email: senderEmail });
      const receiver = await employees.findOne({ email: receiverEmail });

      if (!sender || !receiver) {
        return res.status(404).json({ message: 'Nhân viên không tồn tại' });
      }

      let chat = await Chat.findOne({
        type: 'private',
        members: {
          $all: [
            { $elemMatch: { userEmail: senderEmail } },
            { $elemMatch: { userEmail: receiverEmail } },
          ],
        },
      });

      if (!chat) {
        console.log('Chưa có đoạn chat, tạo mới...');
        chat = new Chat({
          chatID: new mongoose.Types.ObjectId().toString(),
          type: 'private',
          groupName: receiver.fullName,
          members: [
            { userEmail: senderEmail, userName: sender.fullName },
            { userEmail: receiverEmail, userName: receiver.fullName },
          ],
          messages: [],
        });
      }
      const currentTime = new Date();

      const timeInLocal = currentTime.toLocaleString('en-US', {
        timeZoneName: 'short',
      });
      console.log('Thêm tin nhắn vào đoạn chat nha...');
      chat.messages.push({
        senderEmail: senderEmail,
        senderName: sender.fullName,
        content: content,
        timestamp: timeInLocal,
      });

      await chat.save();
      return res.status(200).json({ message: 'Thêm chat thành công' });
    } catch (error) {
      console.error('Lỗi hệ thống:', error);
      return res.status(500).json({ message: 'Lỗi hệ thống' });
    }
  }
  async getmessage(req, res) {
    try {
      const { user1, user2 } = req.query;
      // Lấy thời gian hiện tại theo múi giờ địa phương
      const currentTime = new Date(); // Lấy thời gian hiện tại (theo múi giờ hệ thống)

      const timeInLocal = currentTime.toLocaleString('en-US', {
        timeZoneName: 'short',
      });

      console.log('Thời gian hiện tại theo múi giờ của bạn:', timeInLocal);

      let chat = await Chat.findOne({
        type: 'private',
        members: {
          $all: [
            { $elemMatch: { userEmail: user1 } },
            { $elemMatch: { userEmail: user2 } },
          ],
        },
      });
      if (chat) {
        return res.status(200).json(chat.messages);
      } else {
        return res.status(404).json({ message: 'chua co doan chat' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'loi he thong roi' });
    }
  }
  async getGroup(req, res) {
    try {
      const { email } = req.query;

      // Tìm tất cả nhóm chat mà user này tham gia
      const chats = await Chat.find({ 'members.userEmail': email });

      // Sắp xếp theo tin nhắn mới nhất
      const formattedChats = chats
        .map((chat) => ({
          chatID: chat.chatID,
          members: chat.members.filter((member) => member.userEmail != email),
          lastMessage:
            chat.messages.length > 0
              ? chat.messages[chat.messages.length - 1]
              : null,
        }))
        .sort(
          (a, b) =>
            new Date(b.lastMessage?.timestamp || 0) -
            new Date(a.lastMessage?.timestamp || 0)
        );

      return res.status(200).json(formattedChats);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
}

module.exports = new ChatDB();
