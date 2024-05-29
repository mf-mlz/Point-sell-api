const salesProductsRepository = require('../repositories/salesProductsRepository');

const getAllSalesProducts = () => {
    return salesProductsRepository.getAllSalesProducts();
};

module.exports = {
    getAllSalesProducts
};