const express = require('express');
const router = express.Router();
const salesProductsController = require('../controllers/salesProductsController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyAdminRole } = require('../../../middlewares/adminMiddleware');
const { validateSaleProduct, validateID, validateSaleProductFilter } = require('../../../middlewares/validatorsSaleProduct');

router.get('/', verifyToken, salesProductsController.getAllSalesProducts);

router.post('/register', verifyToken, validateClient, salesProductsController.registerSalesProducts);
router.post('/filter', verifyToken, validateSaleProductFilter, salesProductsController.filterSalesProducts);

router.put('/edit', verifyToken, validateID, validateClient, verifyAdminRole, salesProductsController.putSalesProducts);

router.delete('/delete', verifyToken, validateID, verifyAdminRole, salesProductsController.deleteSalesProducts);

module.exports = router;