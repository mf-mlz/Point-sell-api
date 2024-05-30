const invoicesRepository = require('../repositories/invoicesRepository');

const createInvoice = () => {
    return invoicesRepository.createInvoice();
};

module.exports = {
    createInvoice
}