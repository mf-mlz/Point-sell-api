const connection = require('../../../config/database');

const registerEmployees = (employee) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO employees (name, email, password, phone, address, role_id) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [employee.name, employee.email, employee.password, employee.phone, employee.address, employee.role_id];

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


const putEmployees = (employee) => {
    return new Promise((resolve, reject) => {
        const now = new Date();
        const query = 'UPDATE employees SET name= ?, email= ?, password= ?, phone= ?, address= ?, updated_at= ?, role_id= ? WHERE id= ?';
        const values = [employee.name, employee.email, employee.password, employee.phone, employee.address, employee.updated_at, employee.role_id, employee.id ];

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve('Usuario Modificado Correctamente');
        });

    });
};


module.exports = {
    getAllEmployees,
    registerEmployees,
    getEmployee,
    putEmployees
};