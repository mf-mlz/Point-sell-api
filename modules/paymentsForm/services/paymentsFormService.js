const paymentsFormRepository = require('../repositories/paymentsFormRepository');

const getAllPaymentsForm = (employee) => {
    return paymentsFormRepository.getAllPaymentsForm(employee);
};

const getPaymentsForm = (data) => {
    return paymentsFormRepository.getPaymentsForm(data);
};

const registerPaymentsForm = (data) => {
    return paymentsFormRepository.registerPaymentsForm(data);
};

const putPaymentsForm = (data) => {
    return paymentsFormRepository.putPaymentsForm(data);
};

module.exports = {
    getAllPaymentsForm,
    getPaymentsForm,
    registerPaymentsForm,
    putPaymentsForm,
};