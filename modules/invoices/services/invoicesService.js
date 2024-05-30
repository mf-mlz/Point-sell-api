const invoicesRepository = require('../repositories/invoicesRepository');

const createInvoice = (invoiceData) => {
    return invoicesRepository.createInvoice(invoiceData);
};

module.exports = {
    createInvoice
}