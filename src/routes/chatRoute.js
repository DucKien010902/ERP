const express = require('express');
const route = express.Router();
const chatController = require('../app/controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');
route.post('/sendmessage', chatController.sendmessage);
route.get('/getmessage', chatController.getmessage);
route.get('/getgroup', chatController.getGroup);
module.exports = route;
