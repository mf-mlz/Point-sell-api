const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientsController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyAdminRole } = require('../../../middlewares/adminMiddleware');
const { validateClient, validateID, validateClientFilter } = require('../../../middlewares/validatorsClients');

router.get('/', verifyToken, clientController.getAllClients);

router.post('/register', verifyToken, validateClient, clientController.registerClients);
router.get('/filter', verifyToken, validateClientFilter, clientController.filterClients);
router.put('/edit', verifyToken, validateID, validateClient, verifyAdminRole, clientController.putClients);
router.delete('/delete', verifyToken, validateID, verifyAdminRole, clientController.deleteClient);

module.exports = router;