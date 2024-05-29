const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeesController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyAdminRole } = require('../../../middlewares/adminMiddleware');


router.get('/', verifyToken, employeesController.getAllEmployees);

router.post('/register', employeesController.registerEmployees);
router.post('/login', employeesController.loginEmployees);
router.post('/filter', verifyToken, employeesController.filterEmployees);
router.put('/edit', verifyToken, verifyAdminRole, employeesController.putEmployees);
router.delete('/delete', verifyToken, verifyAdminRole, employeesController.deleteEmployee);

module.exports = router;