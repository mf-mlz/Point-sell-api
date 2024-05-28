const productsService = require('../services/productsService');

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

module.exports = {
    getAllProducts,
    filterProducts
};