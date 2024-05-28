const salesRepository = require('../repositories/salesRepository');

const registerSales = (sale) => {
    return salesRepository.registerSales(sale);
};

const getSale = (data) => {
    return salesRepository.getSale(data);
};

const getAllSales = () => {
    return salesRepository.getAllSales();
};

module.exports = {
    registerSales,
    getAllSales,
    getSale
};