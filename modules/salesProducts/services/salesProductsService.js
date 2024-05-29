const salesProductsRepository = require('../repositories/salesProductsRepository');

const registerSalesProducts = (sale) => {
    return salesProductsRepository.registerSalesProducts(sale);
};

const getAllSalesProducts = () => {
    return salesProductsRepository.getAllSalesProducts();
};

module.exports = {
    registerSalesProducts,
    getAllSalesProducts
};