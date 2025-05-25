const express = require('express');
const route = express.Router();
const employeeController = require('../app/controllers/employeeController');
const scheduleController = require('../app/controllers/scheduleController');
const authMiddleware = require('../middlewares/authMiddleware');
route.get('/getallaccount', employeeController.getAllAccount);
route.post('/setschedule', scheduleController.setSchedule);
route.get('/getschedule', scheduleController.getSchedule);
module.exports = route;
