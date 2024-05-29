const connection = require('../../../config/database');

const registerSalesProducts = (saleProducts) => {
    return new Promise((resolve, reject) => {

        const query = 'INSERT INTO sales_products (salesId, productId, quantity, price) VALUES (?, ?, ?, ?)';
        const values = [saleProducts.salesId, saleProducts.productId, saleProducts.quantity, saleProducts.price];

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve('Producto de Venta Registrada Correctamente');
        });

    });
};

const getAllSalesProducts = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM sales_products', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

module.exports = {
    registerSalesProducts,
    getAllSalesProducts
};