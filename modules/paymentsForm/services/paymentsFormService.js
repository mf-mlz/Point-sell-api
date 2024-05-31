const paymentsFormRepository = require('../repositories/paymentsFormRepository');

const getAllPaymentsForm = (employee) => {
    return paymentsFormRepository.getAllPaymentsForm(employee);
};

const getPaymentsForm = (data) => {
    return paymentsFormRepository.getPaymentsForm(data);
};

module.exports = {
    getAllPaymentsForm,
    getPaymentsForm,
};