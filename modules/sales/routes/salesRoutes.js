const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyRootUser, verifyRolSaleRegister } = require('../../../middlewares/adminMiddleware');
const { validateSale, validateID, validateSaleFilter } = require('../../../middlewares/validatorsSale');
const { processPayment } = require('../../../services/openpay');


router.get('/', verifyToken, salesController.getAllSales);

router.post('/register', verifyToken, validateSale, verifyRolSaleRegister, salesController.registerSales);
router.post('/registerPayment', verifyToken, validateSale, verifyRolSaleRegister, salesController.registerSales);
router.post('/filter', verifyToken, validateSaleFilter, salesController.filterSales);
router.post('/getSaleDate', verifyToken, validateSaleFilter, salesController.getSaleDate);
router.put('/edit', verifyToken, validateID, validateSale, verifyRootUser, salesController.putSale);
router.delete('/delete', verifyToken, validateID, verifyRootUser, salesController.deleteSale);
router.post('/payment', verifyToken, verifyRolSaleRegister, processPayment);

module.exports = router;