const productsRepository = require('../repositories/productsRepository');

const registerProducts = (employee) => {
    return productsRepository.registerProducts(employee);
};

const getAllProducts = () => {
    return productsRepository.getAllProducts();
};

const getProduct = (data) => {
    return productsRepository.getProduct(data);
};

const putProducts = (data) => {
    return productsRepository.putProducts(data);
};

const deleteProduct = (data) => {
    return productsRepository.deleteProduct(data);
};

module.exports = {
    registerProducts,
    getAllProducts,
    getProduct,
    putProducts,
    deleteProduct
};