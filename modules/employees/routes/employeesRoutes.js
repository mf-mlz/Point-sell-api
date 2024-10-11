const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeesController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyRootUser } = require('../../../middlewares/adminMiddleware');
const { validateEmployee, validateEmployeeFilter, validateID, validateEmployeeFilterAll } = require('../../../middlewares/validatorsEmployees');

router.get('/', verifyToken, employeesController.getAllEmployees);

router.post('/register', verifyToken, verifyRootUser, validateEmployee, employeesController.registerEmployees);
router.post('/logout', employeesController.logout);
router.post('/login', employeesController.login);
router.post('/filter', verifyToken, validateEmployeeFilter, employeesController.getEmployee);
router.post('/filterAll', verifyToken, validateEmployeeFilterAll, employeesController.filterEmployeesAll);

router.put('/edit', verifyToken, verifyRootUser, validateID, validateEmployee, employeesController.putEmployees);

router.delete('/delete/:id', verifyToken, verifyRootUser, validateID, employeesController.deleteEmployee);

router.post('/recover', employeesController.recoverPassword);
router.post('/verification', verifyToken, employeesController.verificationToReset);

module.exports = router;