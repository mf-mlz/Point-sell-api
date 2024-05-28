const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const { verifyToken } = require('../../../middleware/authMiddleware');

router.get('/', verifyToken, productsController.getAllProducts);

router.post('/register', verifyToken, productsController.registerProducts);
router.get('/filter', verifyToken, productsController.filterProducts);

module.exports = router;