const express = require('express');
const router = express.Router();
const paymentsFormController = require('../controllers/paymentsFormController');

const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyAdminRole } = require('../../../middlewares/adminMiddleware');

router.get('/', verifyToken, paymentsFormController.getAllPaymentsForm);
router.get('/filter', verifyToken, paymentsFormController.filterPaymentsForm);

router.post('/register', verifyToken, verifyAdminRole, paymentsFormController.registerPaymentsForm);

module.exports = router;