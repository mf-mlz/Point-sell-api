const productsRepository = require('../repositories/productsRepository');

const getAllProducts = () => {
    return productsRepository.getAllProducts();
};

const getProduct = (data) => {
    return productsRepository.getProduct(data);
};

module.exports = {
    getAllProducts,
    getProduct
};