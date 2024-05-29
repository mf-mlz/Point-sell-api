const salesProductsRepository = require('../repositories/salesProductsRepository');

const registerSalesProducts = (sale) => {
    return salesProductsRepository.registerSalesProducts(sale);
};

const getSalesProducts = (data) => {
    return salesProductsRepository.getSalesProducts(data);
};

const getAllSalesProducts = () => {
    return salesProductsRepository.getAllSalesProducts();
};

const putSalesProducts = (sale) => {
    return salesProductsRepository.putSalesProducts(sale);
};

module.exports = {
    registerSalesProducts,
    getSalesProducts,
    getAllSalesProducts,
    putSalesProducts
};