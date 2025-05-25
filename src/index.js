const express = require('express');
const bodyParser = require('body-parser');
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

const db = require('./config/db/index');
db.connect();
const cors = require('cors');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(
  express.static(
    path.join(
      __dirname,
      'C:/Users/Admin/OneDrive - Hanoi University of Science and Technology/Desktop/HOC TAP/ERP'
    )
  )
);
app.use(
  express.static(
    'C:/Users/Admin/OneDrive - Hanoi University of Science and Technology/Desktop/HOC TAP/ERP'
  )
);
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

const route = require('./routes/index');
route(app);
app.listen(5000, '0.0.0.0');
