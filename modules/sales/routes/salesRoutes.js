const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyAdminRole } = require('../../../middlewares/adminMiddleware');

router.get('/', verifyToken, salesController.getAllSales);

router.post('/register', verifyToken, salesController.registerSales);
router.post('/filter', verifyToken, salesController.filterSales);

router.put('/edit', verifyToken, verifyAdminRole, salesController.putSale);

router.delete('/delete', verifyToken, verifyAdminRole, salesController.deleteSale);

module.exports = router;