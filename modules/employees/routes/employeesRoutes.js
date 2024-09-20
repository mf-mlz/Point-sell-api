const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeesController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyAdminRole } = require('../../../middlewares/adminMiddleware');
const { validateEmployee, validateEmployeeFilter, validateID, validateEmployeeFilterAll } = require('../../../middlewares/validatorsEmployees');


router.get('/', verifyToken, employeesController.getAllEmployees);

router.post('/register', verifyToken, verifyAdminRole, validateEmployee, employeesController.registerEmployees);
router.post('/login', employeesController.loginEmployees);
router.post('/filter', verifyToken, validateEmployeeFilter, employeesController.filterEmployees);
router.post('/filterAll', verifyToken, validateEmployeeFilterAll, employeesController.filterEmployeesAll);
router.put('/edit', verifyToken, verifyAdminRole, validateID, validateEmployee, employeesController.putEmployees);
router.delete('/delete', verifyToken, verifyAdminRole, validateID, employeesController.deleteEmployee);

module.exports = router;