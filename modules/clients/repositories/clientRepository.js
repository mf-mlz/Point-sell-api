const connection = require('../../../config/database');

const registerClients = (client) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO clients (name, email, phone, address) VALUES (?, ?, ?, ?)';
        const values = [client.name, client.email, client.phone, client.address];

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve('Cliente Registrado Correctamente');
        });

    });
};

const getAllClients = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM clients', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

const getClient = (data) => {
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

        const query = 'SELECT * FROM clients WHERE ' + keys;

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            const result = JSON.parse(JSON.stringify(results));
            resolve(result);
        });

    });
};

module.exports = {
    registerClients,
    getAllClients,
    getClient
}