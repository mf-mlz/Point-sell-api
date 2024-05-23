const connection = require('../../../config/database');

const registerEmployees = (employee) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO employees (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)';
        const values = [employee.name, employee.email, employee.password, employee.phone, employee.address];

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve('Usuario Registrado Correctamente');
        });

    });
};

const getAllEmployees = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM employees', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};
const getEmployee = (data) => {
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

        const query = 'SELECT * FROM employees WHERE ' + keys + "";

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            const result = JSON.parse(JSON.stringify(results));
            resolve(result);
        });

    });
};

module.exports = {
    getAllEmployees,
    registerEmployees,
    getEmployee
};