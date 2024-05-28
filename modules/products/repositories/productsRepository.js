const connection = require('../../../config/database');

const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM products', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

const getProduct = (data) => {
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

        const query = 'SELECT * FROM products WHERE ' + keys + "";

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            const result = JSON.parse(JSON.stringify(results));
            resolve(result);
        });

    });
};

module.exports = {
    getAllProducts,
    getProduct
};