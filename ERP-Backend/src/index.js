const express = require('express');
// import express from 'express';
// const exphbs = require('express-handlebars');
const path = require('path');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app); // tạo server http
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// socket.io connection
// io.on('connection', (socket) => {
//   console.log('⚡ Client connected:', socket.id);

//   socket.on('sendMessage', (data) => {
//     io.to(data.receiverEmail).emit('receiveMessage', data); // gửi về cho người nhận
//   });

//   socket.on('joinRoom', (email) => {
//     socket.join(email); // mỗi user join 1 "room" theo email để nhận tin nhắn riêng
//   });

//   socket.on('disconnect', () => {
//     console.log('🔌 Client disconnected:', socket.id);
//   });
// });

// app.set('io', io); // cho controller sử dụng io nếu cần (như push từ backend)

const db = require('./config/db/index');
db.connect();
const cors = require('cors');

app.use(cors());
app.use(express.static(path.join(__dirname, 'E:/LOCAL STORE')));
app.use(express.static('E:/LOCAL STORE'));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
// app.engine('handlebars', exphbs.engine());
// app.set('view engine', 'handlebars');
// app.set('views', 'src/resource/views');

const route = require('./routes/index');
route(app);
app.listen(5000, '0.0.0.0');
