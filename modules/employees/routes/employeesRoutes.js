const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeesController');
const { verifyToken } = require('../../../middleware/authMiddleware');


router.get('/', verifyToken, employeesController.getAllEmployees);

router.post('/register', employeesController.registerEmployees);
router.post('/login', employeesController.loginEmployees);

module.exports = router;