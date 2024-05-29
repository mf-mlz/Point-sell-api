
const salesProductsService = require('../services/salesProductsService');
const { verifyData, createUpdatetAt } = require('../../../utils/helpers');
const dotenv = require('dotenv');

dotenv.config();

const getAllSalesProducts = async (req, res) => {
    try {
        const salesProducts = await salesProductsService.getAllSalesProducts();
        res.json(salesProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllSalesProducts
};