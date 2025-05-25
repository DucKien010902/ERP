const express = require('express');
const route = express.Router();
const documentController = require('../app/controllers/documentController');
const authMiddleware = require('../middlewares/authMiddleware');
route.get('/getalldocument', documentController.getAllDocument);
route.get('/resolve-url', documentController.resolveUrl);
route.get('/getFolderChildren', documentController.getFolderChildren);
route.post('/create-folder', documentController.makeNewFolder);
module.exports = route;
