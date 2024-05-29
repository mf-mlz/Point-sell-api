const connection = require('../../../config/database');

const getAllSalesProducts = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM sales_products', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

module.exports = {
    getAllSalesProducts
};