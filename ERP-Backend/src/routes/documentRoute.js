const express = require('express');
const route = express.Router();
const documentController = require('../app/controllers/documentController');
const authMiddleware = require('../middlewares/authMiddleware');
route.get('/getalldocument', documentController.getAllDocument);
route.post('/makenewdocument', documentController.makeNewFolder);
module.exports = route;
