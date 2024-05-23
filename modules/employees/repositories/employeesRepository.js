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

module.exports = {
    getAllEmployees,
    registerEmployees
};