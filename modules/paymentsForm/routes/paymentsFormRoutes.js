const express = require('express');
const router = express.Router();
const paymentsFormController = require('../controllers/paymentsFormController');

const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyAdminRole } = require('../../../middlewares/adminMiddleware');

module.exports = router;