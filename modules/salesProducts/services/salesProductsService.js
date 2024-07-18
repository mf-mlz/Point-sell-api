const salesProductsRepository = require('../repositories/salesProductsRepository');

const registerSalesProducts = (sale) => {
    return salesProductsRepository.registerSalesProducts(sale);
};

const getSalesProducts = (data) => {
    return salesProductsRepository.getSalesProducts(data);
};

const getSalesJoinProducts = (data) => {
    return salesProductsRepository.getSalesJoinProducts(data);
};

const getAllSalesProducts = () => {
    return salesProductsRepository.getAllSalesProducts();
};

const putSalesProducts = (sale) => {
    return salesProductsRepository.putSalesProducts(sale);
};

const deleteSalesProducts = (sale) => {
    return salesProductsRepository.deleteSalesProducts(sale);
};

const getInfoTicket = (sale) => {
    return salesProductsRepository.getInfoTicket(sale);
};


module.exports = {
    registerSalesProducts,
    getSalesProducts,
    getSalesJoinProducts,
    getAllSalesProducts,
    putSalesProducts,
    deleteSalesProducts,
    getInfoTicket
};