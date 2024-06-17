const express = require('express');
const router = express.Router();
const paymentsFormController = require('../controllers/paymentsFormController');

const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyAdminRole } = require('../../../middlewares/adminMiddleware');
const { validateID, validatePaymentForm, validatePaymentFormFilter } = require('../../../middlewares/validatorsPaymentsForm');

router.get('/', verifyToken, paymentsFormController.getAllPaymentsForm);
router.get('/filter', verifyToken, validatePaymentFormFilter, paymentsFormController.filterPaymentsForm);

router.post('/register', verifyToken, verifyAdminRole, validatePaymentForm, paymentsFormController.registerPaymentsForm);

router.put('/edit', verifyToken, verifyAdminRole, validateID, validatePaymentForm,  paymentsFormController.putPaymentsForm);

router.delete('/delete', verifyToken, verifyAdminRole, validateID, paymentsFormController.deletePaymentsForm);

module.exports = router;