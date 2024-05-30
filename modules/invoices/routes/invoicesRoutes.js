const express = require('express');
const router = express.Router();
const invoicesController = require('../controllers/invoicesController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyAdminRole } = require('../../../middlewares/adminMiddleware');

router.post('/create', verifyToken, invoicesController.createInvoice);

module.exports = router;