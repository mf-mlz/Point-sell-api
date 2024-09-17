const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyAdminRole } = require('../../../middlewares/adminMiddleware');
const { validateSale, validateID, validateSaleFilter } = require('../../../middlewares/validatorsSale');


router.get('/', verifyToken, salesController.getAllSales);

router.post('/register', verifyToken, verifyAdminRole, salesController.registerSales);
router.post('/filter', verifyToken, validateSaleFilter, salesController.filterSales);
router.post('/getSaleDate', verifyToken, validateSaleFilter, salesController.getSaleDate);

router.put('/edit', verifyToken, validateID, validateSale, verifyAdminRole, salesController.putSale);

router.delete('/delete', verifyToken, validateID, verifyAdminRole, salesController.deleteSale);

module.exports = router;