const invoicesRepository = require('../repositories/invoicesRepository');

const createInvoice = (invoiceData) => {
    return invoicesRepository.createInvoice(invoiceData);
};

const sendEmail = (data) => {
    return invoicesRepository.sendEmail(data);
};

module.exports = {
    createInvoice,
    sendEmail
}