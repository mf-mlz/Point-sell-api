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

const deletePaymentsForm = (data) => {
    return paymentsFormRepository.deletePaymentsForm(data);
};

module.exports = {
    getAllPaymentsForm,
    getPaymentsForm,
    registerPaymentsForm,
    putPaymentsForm,
    deletePaymentsForm
};