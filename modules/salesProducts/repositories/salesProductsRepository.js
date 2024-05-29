const connection = require('../../../config/database');

const registerSalesProducts = (saleProducts) => {
    return new Promise((resolve, reject) => {

        const query = 'INSERT INTO sales_products (salesId, productId, quantity, total) VALUES (?, ?, ?, ?)';
        const values = [saleProducts.salesId, saleProducts.productId, saleProducts.quantity, saleProducts.total];

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

const putSalesProducts = (salesProducts) => {
    return new Promise((resolve, reject) => {
        const now = new Date();
        const query = 'UPDATE sales_products SET salesId= ?, productId= ?, quantity= ?, total= ?, updated_at= ?  WHERE id = ?';
        const values = [salesProducts.salesId, salesProducts.productId, salesProducts.quantity, salesProducts.total, salesProducts.updated_at, salesProducts.id ];

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve('Venta Modificada Correctamente');
        });

    });
};

const deleteSalesProducts = (salesProducts) => {
    return new Promise((resolve, reject) => {
        const now = new Date();
        const query = 'DELETE FROM sales_products WHERE id= ?';
        const values = [salesProducts.id ];

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve('Venta Eliminada Correctamente');
        });

    });
};


module.exports = {
    registerSalesProducts,
    getSalesProducts,
    getAllSalesProducts,
    putSalesProducts,
    deleteSalesProducts
};