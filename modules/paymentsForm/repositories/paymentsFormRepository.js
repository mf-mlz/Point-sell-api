const connection = require('../../../config/database');

const getAllPaymentsForm = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM formasdepago', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

const getPaymentsForm = (data) => {

    return new Promise((resolve, reject) => {
        let values = ["%" + data.descripcion + "%"];
        const query = "SELECT * FROM formasdepago WHERE descripcion like ?;";
        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            const result = JSON.parse(JSON.stringify(results));
            resolve(result);
        });

    });
};

const registerPaymentsForm = (paymentForm) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO formasdepago ( descripcion ) VALUES (?);';
        const values = [paymentForm.descripcion];
        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve('Forma de Pago Registrado Correctamente');
        });

    });
};

module.exports = {
    getAllPaymentsForm,
    getPaymentsForm,
    registerPaymentsForm,
