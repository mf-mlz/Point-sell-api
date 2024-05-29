const express = require('express');
const router = express.Router();
const salesProductsController = require('../controllers/salesProductsController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyAdminRole } = require('../../../middlewares/adminMiddleware');

router.get('/', verifyToken, salesProductsController.getAllSalesProducts);

module.exports = router;