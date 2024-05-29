const productsService = require('../services/productsService');
const { verifyData,createUpdatetAt } = require('../../../utils/helpers');

const registerProducts = async (req, res) => {

    const requiredFields = ['name', 'description', 'price', 'category', 'stock', 'photo'];
    const data = req.body;
    delete data.employeeId;

    const missingField = verifyData(requiredFields, data);
    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    try {

        const registerProductsServices = await productsService.registerProducts(data);
        res.status(201).json({ message: registerProductsServices });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const filterProducts = async (req, res) => {

    const data = req.body;
    try {

        delete data.employeeId;
        const productData = await productsService.getProduct(data);
        if (productData.length > 0) {
            res.status(401).json({ message: `Se encontraron ${productData.length} registros`, product: productData });

        }else{
            res.status(401).json({ message: `No se encontraron registros` });
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

    const requiredFields = ['id', 'name', 'description', 'price', 'category', 'stock', 'photo'];

    const data = req.body;

    const missingField = verifyData(requiredFields, data);
    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    const { id, name, email, password, phone, address, role_id } = data;

    try {

        data.updated_at = createUpdatetAt();

        const registerProductsServices = await productsService.putProducts(data);
        res.status(201).json({ message: registerProductsServices });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    registerProducts,
    getAllProducts,
    filterProducts,
    putProducts
};