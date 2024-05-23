const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeesController');
const verifyToken = require('../../../middleware/authMiddleware');


//router.get('/', verifyToken, employeesController.getAllEmployees);
router.get('/', employeesController.getAllEmployees);
router.post('/register', employeesController.registerEmployees);

module.exports = router;