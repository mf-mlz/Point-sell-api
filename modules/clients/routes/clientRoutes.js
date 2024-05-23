const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientsController');
const { verifyToken } = require('../../../middleware/authMiddleware');

router.get('/', verifyToken, clientController.getAllClients);

module.exports = router;