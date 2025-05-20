const express = require('express');
const route = express.Router();
const timekeepingController = require('../app/controllers/timekeepingController');
const authMiddleware = require('../middlewares/authMiddleware');
route.post('/addcheckindata', timekeepingController.addCheckData);
route.get('/getallcheckin', timekeepingController.getallCheckIn);
module.exports = route;
