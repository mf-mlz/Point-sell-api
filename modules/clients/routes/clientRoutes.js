const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientsController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyAdminRole } = require('../../../middlewares/adminMiddleware');

router.get('/', verifyToken, clientController.getAllClients);

router.post('/register', verifyToken, clientController.registerClients);
router.get('/filter', verifyToken, clientController.filterClients);
router.put('/edit', verifyToken, verifyAdminRole, clientController.putClients);
router.delete('/delete', verifyToken, verifyAdminRole, clientController.deleteClient);

module.exports = router;