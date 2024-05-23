const connection = require('../../../config/database');

exports.getAllClients = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM clients', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};
