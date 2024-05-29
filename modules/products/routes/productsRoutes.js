const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyAdminRole } = require('../../../middlewares/adminMiddleware');

router.get('/', verifyToken, productsController.getAllProducts);

router.post('/register', verifyToken, verifyAdminRole, productsController.registerProducts);
router.get('/filter', verifyToken, productsController.filterProducts);
router.put('/edit', verifyToken, verifyAdminRole, productsController.putProducts);
router.delete('/delete', verifyToken, verifyAdminRole, productsController.deleteProduct);

module.exports = router;