const productsRepository = require('../repositories/productsRepository');

const getAllProducts = () => {
    return productsRepository.getAllProducts();
};

module.exports = {
    getAllProducts
};