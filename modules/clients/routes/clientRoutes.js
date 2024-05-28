const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientsController');
const { verifyToken } = require('../../../middleware/authMiddleware');

router.get('/', verifyToken, clientController.getAllClients);

router.post('/register', verifyToken, clientController.registerClients);
router.get('/filter', verifyToken, clientController.filterClients);
router.put('/edit', verifyToken, clientController.putClients);

module.exports = router;