const productsService = require('../services/productsService');
const { verifyData, createUpdatetAt } = require('../../../utils/helpers');
const fs = require('fs');
const path = require('path');

const registerProducts = async (req, res) => {

    const requiredFields = ['name', 'description', 'price', 'category', 'stock', 'key_sat'];
    const data = req.body;
    delete data.employeeId;

    const missingField = verifyData(requiredFields, data);
    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    try {

        const registerProductsServices = await productsService.registerProducts(data);
        res.status(201).json(registerProductsServices);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const uploadPhoto = async (req, res) => {

    const requiredFields = ['id', 'photo'];

    const data = {
        id: req.body.id_product,
        photo: req.file.originalname
    };

    const missingField = verifyData(requiredFields, data);
    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    const { id, photo } = data;

    try {

        data.updated_at = createUpdatetAt();
        const putProductPhotoServices = await productsService.putProductPhoto(data);
        res.status(201).json({ message: putProductPhotoServices });
    } catch (err) {
        res.status(500).json({ error: err });
    }

}

const filterProducts = async (req, res) => {

    const data = req.body;
    try {

        delete data.employeeId;
        const productData = await productsService.getProduct(data);
        if (productData.length > 0) {
            res.status(200).json({ message: `Se encontraron ${productData.length} registros`, product: productData });

        } else {
            res.status(200).json({ message: `No se encontraron registros`, product: [] });
        }

    } catch (err) {
        res.status(500).json({ error: 'Ocurrió un error al obtener los registros' });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await productsService.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const putProducts = async (req, res) => {

    const requiredFields = ['id', 'name', 'description', 'price', 'category', 'stock', 'key_sat'];

    const data = req.body;

    const missingField = verifyData(requiredFields, data);
    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    const { id, name, email, password, address, role_id } = data;

    try {

        data.updated_at = createUpdatetAt();

        const registerProductsServices = await productsService.putProducts(data);
        res.status(201).json({ message: registerProductsServices });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteProduct = async (req, res) => {

    const requiredFields = ['id'];
    const data = req.body;

    const missingField = verifyData(requiredFields, data);
    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    const { id } = data;

    try {

        const deleteProductServices = await productsService.deleteProduct(data);
        res.status(201).json({ message: deleteProductServices });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const products = await productsService.getCategories();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllKeySatProducts = async (req, res) => {
    try {
        const products = await productsService.getAllKeySatProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerProducts,
    uploadPhoto,
    getAllProducts,
    filterProducts,
    putProducts,
    deleteProduct,
    getCategories,
    getAllKeySatProducts
};