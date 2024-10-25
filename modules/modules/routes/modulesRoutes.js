const express = require('express');
const router = express.Router();
const modulesController = require('../controllers/modulesController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyRootUser } = require('../../../middlewares/adminMiddleware');
const { validateID, validatePermissions, validatePermissionsFilter } = require('../../../middlewares/validatorsPermissions');

router.get('/', verifyToken, verifyRootUser, modulesController.getAllModules);
router.get('/getModulesAndSubmodules', verifyToken, verifyRootUser, modulesController.getAllModulesAndSubmodules);
// router.get('/getPermissionsByRole', verifyToken, modulesController.getPermissionsByRoleAndModule);
// router.get('/getModuleAccessByRole', verifyToken, modulesController.getModuleAccessByRole);

// router.post('/register', verifyToken, verifyRootUser, validatePermissions, modulesController.registerPermissions);
// router.post('/filter', verifyToken, verifyRootUser, validateID, validatePermissionsFilter, modulesController.filterPermissions);

// router.put('/edit', verifyToken, verifyRootUser, validateID, validatePermissions, modulesController.editPermissions);

// router.delete('/delete/:id', verifyToken, verifyRootUser, validateID, modulesController.deletePermissions);

module.exports = router;