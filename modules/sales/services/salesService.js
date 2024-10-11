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

const getSaleInfoCompleteById = (id) => {
    return salesRepository.getSaleInfoCompleteById(id);
};

const putSale = (sale) => {
    return salesRepository.putSale(sale);
};

const deleteSale = (sale) => {
    return salesRepository.deleteSale(sale);
};
const postSaleDate = (sale) => {
    return salesRepository.postSaleDate(sale);
};

module.exports = {
    registerSales,
    getAllSales,
    getSale,
    putSale,
    deleteSale,
    postSaleDate,
    getSaleInfoCompleteById
};