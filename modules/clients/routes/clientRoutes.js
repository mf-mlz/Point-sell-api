const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientsController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyRootUser } = require('../../../middlewares/adminMiddleware');
const { validateClient, validateID, validateClientFilter } = require('../../../middlewares/validatorsClients');

router.get('/', verifyToken, clientController.getAllClients);

router.post('/register', verifyToken, verifyRootUser, validateClient, clientController.registerClients);
router.get('/filter', verifyToken, validateClientFilter, clientController.filterClients);
router.put('/edit', verifyToken, validateID, validateClient, verifyRootUser, clientController.putClients);
router.delete('/delete', verifyToken, validateID, verifyRootUser, clientController.deleteClient);

module.exports = router;