const connection = require('../../../config/database');

const registerProducts = (product) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO products (name, description, price, category, stock) VALUES (?, ?, ?, ?, ?)';
        const values = [product.name, product.description, product.price, product.category, product.stock];

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve('Producto Registrado Correctamente');
        });

    });
};

const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM products', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

const putProductPhoto = (product) => {
    return new Promise((resolve, reject) => {
        const now = new Date();
        const query = 'UPDATE products SET  photo= ?, updated_at= ? WHERE id= ?';
        const values = [product.photo, product.updated_at, product.id];

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve('Archivo Subido con Éxito');
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

const putProducts = (product) => {
    return new Promise((resolve, reject) => {
        const now = new Date();
        const query = 'UPDATE products SET name= ?, description= ?, price= ?, category= ?, stock= ?, updated_at= ? WHERE id= ?';
        const values = [product.name, product.description, product.price, product.category, product.stock, product.updated_at, product.id];

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve('Producto Modificado Correctamente');
        });

    });
};

const deleteProduct = (employee) => {
    return new Promise((resolve, reject) => {
        const now = new Date();
        const query = 'DELETE FROM products WHERE id= ?';
        const values = [employee.id];

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve('Usuario Eliminado Correctamente');
        });

    });
};

module.exports = {
    registerProducts,
    getAllProducts,
    putProductPhoto,
    getProduct,
    putProducts,
    deleteProduct
};