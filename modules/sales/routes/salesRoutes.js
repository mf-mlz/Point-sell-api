const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { verifyToken } = require('../../../middleware/authMiddleware');


router.get('/', verifyToken, salesController.getAllSales);

router.post('/register', verifyToken, salesController.registerSales);
router.post('/filter', verifyToken, salesController.filterSales);

router.put('/edit', verifyToken, salesController.putSale);

router.delete('/delete', verifyToken, salesController.deleteSale);

module.exports = router;