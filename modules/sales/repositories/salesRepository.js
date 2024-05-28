const connection = require('../../../config/database');

const registerSales = (sale) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO sales (date, totalAmount, customerId, employeesId, status) VALUES (?, ?, ?, ?, ?)';
        const values = [sale.date, sale.totalAmount, sale.customerId, sale.employeesId, sale.status];

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve('Venta Registrada Correctamente');
        });

    });
};

const getAllSales = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM sales', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

const getSale = (data) => {
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

        const query = 'SELECT * FROM sales WHERE ' + keys + "";

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            const result = JSON.parse(JSON.stringify(results));
            resolve(result);
        });

    });
};

const putSale = (sale) => {
    return new Promise((resolve, reject) => {
        const now = new Date();
        const query = 'UPDATE sales SET date= ?, totalAmount= ?, customerId= ?, employeesId= ?, status= ?, updated_at= ? WHERE id = ?';
        const values = [sale.date, sale.totalAmount, sale.customerId, sale.employeesId, sale.status, sale.updated_at, sale.id ];

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve('Venta Modificada Correctamente');
        });

    });
};

const deleteSale = (employee) => {
    return new Promise((resolve, reject) => {
        const now = new Date();
        const query = 'DELETE FROM sales WHERE id= ?';
        const values = [employee.id ];

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve('Venta Eliminada Correctamente');
        });

    });
};

module.exports = {
    registerSales,
    getAllSales,
    getSale,
    putSale,
    deleteSale
};