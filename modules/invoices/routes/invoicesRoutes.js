const express = require('express');
const router = express.Router();
const invoicesController = require('../controllers/invoicesController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyAdminRole } = require('../../../middlewares/adminMiddleware');
const { validateID, validateInvoice, validateInvoiceFilter, validateIdDownload, validateDataCancel } = require('../../../middlewares/validatorsInvoice');

router.post('/create', verifyToken, verifyAdminRole, validateInvoice, invoicesController.createInvoice);
router.post('/sendEmail', verifyToken, verifyAdminRole, invoicesController.sendEmail);
router.post('/download', verifyToken, verifyAdminRole, validateIdDownload, invoicesController.downloadInvoice);
router.post('/cancel', verifyToken, verifyAdminRole, validateDataCancel, invoicesController.cancelInvoice);
router.post('/getByIdSale', verifyToken, verifyAdminRole, validateID, invoicesController.getInvoicesByIdSale);

module.exports = router;