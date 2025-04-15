const express = require('express');
const route = express.Router();
const employeeController = require('../app/controllers/employeeController');
const chatController = require('../app/controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');
route.post('/updateaccount', authMiddleware, employeeController.updateAccount);
route.get('/getaccount', authMiddleware, employeeController.getAccount);
route.get('/getallaccount', employeeController.getAllAccount);
module.exports = route;
