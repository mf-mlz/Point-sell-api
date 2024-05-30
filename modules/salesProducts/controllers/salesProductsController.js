
const salesProductsService = require('../services/salesProductsService');
const productsService = require('../../products/services/productsService');
const { verifyData, createUpdatetAt } = require('../../../utils/helpers');
const dotenv = require('dotenv');

dotenv.config();

const registerSalesProducts = async (req, res) => {

    const requiredFields = ['salesId', 'productId', 'quantity'];
    const data = req.body

    const missingField = verifyData(requiredFields, data);

    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    const { salesId, productId, quantity } = data;

    try {

        const obj = { id: productId }
        const productData = await productsService.getProduct(obj);
        const productPrice = productData[0]?.price;
        data.total = parseFloat(productPrice) * parseFloat(quantity);
        const registerSalesProductsService = await salesProductsService.registerSalesProducts(data);
        res.status(201).json({ message: registerSalesProductsService });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const filterSalesProducts = async (req, res) => {

    const data = req.body;
    try {
        delete data.employeeId;
        const salesData = await salesProductsService.getSalesProducts(data);
        if (salesData.length > 0) {
            res.status(401).json({ message: `Se encontraron ${salesData.length} registros`, sales: salesData });

        } else {
            res.status(401).json({ message: `No se encontraron registros` });
        }

    } catch (err) {
        res.status(500).json({ error: 'Ocurrió un error al obtener los registros' });
    }

};

const filterJoinSalesProducts = async (req, res) => {

    const data = req.body;
    try {
        delete data.employeeId;
        const salesData = await salesProductsService.getSalesJoinProducts(data);
        if (salesData.length > 0) {
            res.status(401).json({ message: `Se encontraron ${salesData.length} registros`, sales: salesData });

        } else {
            res.status(401).json({ message: `No se encontraron registros` });
        }

    } catch (err) {
        res.status(500).json({ error: 'Ocurrió un error al obtener los registros' });
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

const putSalesProducts = async (req, res) => {

    const requiredFields = ['id', 'salesId', 'productId', 'quantity', 'total'];
    const data = req.body;

    const missingField = verifyData(requiredFields, data);
    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    const { id, salesId, productId, quantity, total } = data;

    try {

        data.updated_at = createUpdatetAt();

        const salesProductsServices = await salesProductsService.putSalesProducts(data);
        res.status(201).json({ message: salesProductsServices });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteSalesProducts = async (req, res) => {

    const requiredFields = ['id'];
    const data = req.body;

    const missingField = verifyData(requiredFields, data);
    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    const { id } = data;

    try {

        const deleteSalesProductsServices = await salesProductsService.deleteSalesProducts(data);
        res.status(201).json({ message: deleteSalesProductsServices });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    registerSalesProducts,
    filterSalesProducts,
    filterJoinSalesProducts,
    getAllSalesProducts,
    putSalesProducts,
    deleteSalesProducts
};