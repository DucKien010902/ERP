const express = require('express');
const route = express.Router();
const authcontroller = require('../app/controllers/employeeController');
const authMiddleware = require('../middlewares/authMiddleware');
route.post('/checkaccount', authcontroller.check);
route.post('/creataccount', authcontroller.creat);
module.exports = route;
// export default route;
