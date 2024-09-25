const salesService = require('../services/salesService');
const { verifyData, createUpdatetAt } = require('../../../utils/helpers');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const registerSales = async (req, res) => {

    const requiredFields = ['date', 'totalAmount', 'payment', 'dataPayment', 'customerId', 'employeesId', 'status'];
    const data = req.body;

    const missingField = verifyData(requiredFields, data);
    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    const { date, totalAmount, payment, dataPayment, customerId, employeesId, status } = data;

    try {

        const registerSalesService = await salesService.registerSales(data);
        res.status(201).json({ message: registerSalesService });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const filterSales = async (req, res) => {

    const data = req.body;
    try {
        delete data.employeeId;
        const salesData = await salesService.getSale(data);
        if (salesData.length > 0) {
            res.status(401).json({ message: `Se encontraron ${salesData.length} registros`, sales: salesData });

        } else {
            res.status(401).json({ message: `No se encontraron registros` });
        }

    } catch (err) {
        res.status(500).json({ error: 'Ocurrió un error al obtener los registros' });
    }

};

const getAllSales = async (req, res) => {
    try {
        const sales = await salesService.getAllSales();
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const putSale = async (req, res) => {

    const requiredFields = ['id', 'date', 'payment', 'dataPayment', 'customerId', 'employeesId', 'status'];
    const data = req.body;

    const missingField = verifyData(requiredFields, data);
    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    const { id, date, totalAmount, payment, dataPayment, customerId, employeesId, status } = data;

    try {

        data.updated_at = createUpdatetAt();

        const salesEmployeesServices = await salesService.putSale(data);
        res.status(201).json({ message: salesEmployeesServices });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteSale = async (req, res) => {

    const requiredFields = ['id'];
    const data = req.body;

    const missingField = verifyData(requiredFields, data);
    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    const { id } = data;

    try {

        const deleteSaleServices = await salesService.deleteSale(data);
        res.status(201).json({ message: deleteSaleServices });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getSaleDate = async (req, res) => {

    const data = req.body;
    try {
        delete data.employeeId;
        const getSaleDate = await salesService.getSaleDate(data);
        if (getSaleDate.length > 0) {
            res.status(200).json({ message: `Se encontraron ${getSaleDate.length} registros`, sales: getSaleDate });

        } else {
            res.status(200).json({ message: `No se encontraron registros` });
        }

    } catch (err) {
        res.status(500).json({ error: 'Ocurrió un error al obtener los registros' });
    }

};

module.exports = {
    registerSales,
    filterSales,
    getAllSales,
    putSale,
    deleteSale,
    getSaleDate
};