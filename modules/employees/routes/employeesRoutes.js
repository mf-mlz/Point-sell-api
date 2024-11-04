const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeesController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyRootUser } = require('../../../middlewares/adminMiddleware');
const { validateEmployee, validateEmployeeFilter, validateID, validateEmployeeFilterAll } = require('../../../middlewares/validatorsEmployees');

router.get('/', verifyToken, employeesController.getAllEmployees);
router.get('/getDataSession', verifyToken, employeesController.returnDataSession);
router.get('/getModulesSession', verifyToken, employeesController.returnModuleSession);

router.post('/register', verifyToken, verifyRootUser, validateEmployee, employeesController.registerEmployees);
router.post('/logout', employeesController.logout);
router.post('/login', employeesController.login);
router.post('/filter', verifyToken, validateEmployeeFilter, employeesController.getEmployee);
router.post('/filterAll', verifyToken, validateEmployeeFilterAll, employeesController.filterEmployeesAll);
router.post('/recover', employeesController.recoverPassword);
router.post('/verifyCode', employeesController.verifyCode);

router.put('/verification', employeesController.verificationToReset);
router.put('/edit', verifyToken, verifyRootUser, validateID, validateEmployee, employeesController.putEmployees);

router.delete('/delete/:id', verifyToken, verifyRootUser, validateID, employeesController.deleteEmployee);


module.exports = router;