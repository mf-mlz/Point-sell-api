const express = require('express');
const router = express.Router();
const paymentsFormController = require('../controllers/paymentsFormController');

const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyRootUser } = require('../../../middlewares/adminMiddleware');
const { validateID, validatePaymentForm, validatePaymentFormFilter } = require('../../../middlewares/validatorsPaymentsForm');

router.get('/', verifyToken, paymentsFormController.getAllPaymentsForm);
router.get('/filter', verifyToken, validatePaymentFormFilter, paymentsFormController.filterPaymentsForm);

router.post('/register', verifyToken, verifyRootUser, validatePaymentForm, paymentsFormController.registerPaymentsForm);

router.put('/edit', verifyToken, verifyRootUser, validateID, validatePaymentForm,  paymentsFormController.putPaymentsForm);

router.delete('/delete', verifyToken, verifyRootUser, validateID, paymentsFormController.deletePaymentsForm);

module.exports = router;