const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
router.get('/', verifyToken, productsController.getAllProducts);

router.get('/filter', verifyToken, productsController.filterProducts);

module.exports = router;