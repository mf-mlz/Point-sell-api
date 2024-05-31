const getPaymentsForm = (data) => {
    return paymentsFormRepository.getPaymentsForm(data);
};

module.exports = {
    getPaymentsForm,
};