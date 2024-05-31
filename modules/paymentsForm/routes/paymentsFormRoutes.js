const express = require('express');
const router = express.Router();
const paymentsFormController = require('../controllers/paymentsFormController');

const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyAdminRole } = require('../../../middlewares/adminMiddleware');

router.get('/', verifyToken, paymentsFormController.getAllPaymentsForm);
router.get('/filter', verifyToken, paymentsFormController.filterPaymentsForm);

router.post('/register', verifyToken, verifyAdminRole, paymentsFormController.registerPaymentsForm);

router.put('/edit', verifyToken, verifyAdminRole, paymentsFormController.putPaymentsForm);

router.delete('/delete', verifyToken, verifyAdminRole, paymentsFormController.deletePaymentsForm);

module.exports = router;