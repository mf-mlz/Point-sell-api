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

const getSalesProducts = (data) => {
    return new Promise((resolve, reject) => {

        let keys = "";
        let values = [];

        Object.entries(data).forEach(([key, value]) => {

            values.push(value);
            keys += key + " = ? OR ";
        });

        keys = keys.trim();

        if (keys.endsWith('OR')) {
            keys = keys.substring(0, keys.length - 2);
        }

        const query = 'SELECT * FROM sales_products WHERE ' + keys + "";

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            const result = JSON.parse(JSON.stringify(results));
            resolve(result);
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
    getSalesProducts,
    getAllSalesProducts
};