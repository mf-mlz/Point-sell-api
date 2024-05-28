const connection = require('../../../config/database');

const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM products', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

module.exports = {
    getAllProducts
};