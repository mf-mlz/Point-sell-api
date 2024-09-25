const express = require('express');
const router = express.Router();
const salesProductsController = require('../controllers/salesProductsController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyAdminRole } = require('../../../middlewares/adminMiddleware');
const { validateSaleProduct, validateID, validateSaleProductFilter } = require('../../../middlewares/validatorsSaleProduct');

router.get('/', verifyToken, salesProductsController.getAllSalesProducts);

router.post('/register', verifyToken, validateSaleProduct, salesProductsController.registerSalesProducts);
router.post('/filter', verifyToken, validateSaleProductFilter, salesProductsController.filterSalesProducts);
router.post('/filterDescription', verifyToken, validateSaleProductFilter, salesProductsController.filterJoinSalesProducts);

router.put('/edit', verifyToken, validateID, validateSaleProduct, verifyAdminRole, salesProductsController.putSalesProducts);

router.delete('/delete', verifyToken, validateID, verifyAdminRole, salesProductsController.deleteSalesProducts);
router.post('/generateTicket', verifyToken, /* validateID,  */salesProductsController.generateTicket);


module.exports = router;