const express = require('express');
const route = express.Router();
const customerController = require('../app/controllers/customerController');
const authMiddleware = require('../middlewares/authMiddleware');
route.post('/checkaccount', customerController.check);
route.post('/createaccount', customerController.creat);
module.exports = route;
