
const salesProductsService = require('../services/salesProductsService');
const { verifyData, createUpdatetAt } = require('../../../utils/helpers');
const dotenv = require('dotenv');

dotenv.config();

const registerSalesProducts = async (req, res) => {

    const requiredFields = ['salesId', 'productId', 'quantity', 'price'];
    const data = req.body;

    const missingField = verifyData(requiredFields, data);
    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    const { salesId, productId, quantity, price } = data;

    try {

        const registerSalesProductsService = await salesProductsService.registerSalesProducts(data);
        res.status(201).json({ message: registerSalesProductsService });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllSalesProducts = async (req, res) => {
    try {
        const salesProducts = await salesProductsService.getAllSalesProducts();
        res.json(salesProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerSalesProducts,
    getAllSalesProducts
};