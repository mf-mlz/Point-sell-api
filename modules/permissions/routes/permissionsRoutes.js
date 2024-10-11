const express = require('express');
const router = express.Router();
const permissionsController = require('../controllers/permissionsController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyRootUser } = require('../../../middlewares/adminMiddleware');
const { validateID, validatePermissions, validatePermissionsFilter } = require('../../../middlewares/validatorsPermissions');

router.get('/', verifyToken, verifyRootUser, permissionsController.getAllPermissions);

router.post('/register', verifyToken, verifyRootUser, validatePermissions, permissionsController.registerPermissions);
router.post('/filter', verifyToken, verifyRootUser, validateID, validatePermissionsFilter, permissionsController.filterPermissions);

router.put('/edit', verifyToken, verifyRootUser, validateID, validatePermissions, permissionsController.editPermissions);

router.delete('/delete/:id', verifyToken, verifyRootUser, validateID, permissionsController.deletePermissions);

module.exports = router;