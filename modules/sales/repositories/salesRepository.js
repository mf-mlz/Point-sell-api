const connection = require('../../../config/database');

const registerSales = async (sale) => {
    try {
        const products = sale.products;

        // Verificar el stock de todos los productos
        for (const product of products) {
            const q = 'call verify_stock(?);';
            const v = [product.id];
            const results = await queryDatabase(q, v);

            if (!results || !results.length || !results[0].length) {
                throw new Error(`Error al verificar el stock del producto ${product.description}`);
            }

            const arrayP = results[0][0];

            if (arrayP.stock < product.quantity) {
                throw new Error(`No hay suficiente stock de producto ${product.description}, solo cuentas con ${arrayP.stock} existencias`);
            }
        }

        // Insertar la venta en la base de datos
        const query = 'INSERT INTO sales (date, totalAmount, payment, dataPayment, customerId, employeesId, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [sale.date, sale.totalAmount, sale.payment, sale.dataPayment, sale.customerId, sale.employeesId, sale.status];
        await queryDatabase(query, values);

        // Actualizar el stock de todos los productos
        for (const product of products) {
            const q = 'call update_stock(?,?);';
            const v = [product.id, product.quantity];
            await queryDatabase(q, v);
        }

        return 'Venta registrada y stock actualizado correctamente';

    } catch (error) {
        throw new Error(`Error al registrar la venta: ${error.message}`);
    }
};

// Función auxiliar para realizar consultas a la base de datos
const queryDatabase = (query, values) => {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};


const getAllSales = () => {
    return new Promise((resolve, reject) => {
        connection.query('CALL get_complete_info_sale()', (error, results) => {
            if (error) return reject(error);
            resolve(results[0]);
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
        const query = 'UPDATE sales SET date= ?, totalAmount= ?, payment=?, dataPayment=?, customerId= ?, employeesId= ?, status= ?, updated_at= ? WHERE id = ?';
        const values = [sale.date, sale.totalAmount, sale.payment, sale.dataPayment, sale.customerId, sale.employeesId, sale.status, sale.updated_at, sale.id];

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
        const values = [employee.id];

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve('Venta Eliminada Correctamente');
        });

    });
};

const getSaleDate = (data) => {
    return new Promise((resolve, reject) => {

        let values = [];
        Object.entries(data).forEach(([key, value]) => {
            values.push(value);
        });

        const k = "date > ? AND date < ?";
        const query = ' SELECT * FROM sales WHERE ' + k + ';';
        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            const result = JSON.parse(JSON.stringify(results));
            resolve(result);
        });

    });
};

module.exports = {
    registerSales,
    getAllSales,
    getSale,
    putSale,
    deleteSale,
    getSaleDate
};