const express = require('express');
const router = express.Router();
const invoicesController = require('../controllers/invoicesController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyRootUser, verifyRolSaleRegister } = require('../../../middlewares/adminMiddleware');
const { validateID, validateInvoice, validateIdDownload, validateDataCancel } = require('../../../middlewares/validatorsInvoice');

router.post('/create', verifyToken, verifyRootUser, validateInvoice, invoicesController.createInvoice);
router.post('/sendEmail', verifyToken, verifyRootUser, invoicesController.sendEmail);
router.post('/download', verifyToken, verifyRootUser, validateIdDownload, invoicesController.downloadInvoice);
router.post('/cancel', verifyToken, verifyRootUser, validateDataCancel, invoicesController.cancelInvoice);
router.post('/getByIdSale', verifyToken, verifyRolSaleRegister, validateID, invoicesController.getInvoicesByIdSale);

module.exports = router;