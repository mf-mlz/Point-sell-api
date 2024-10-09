const connection = require("../../../config/database");

const registerProducts = (product) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO products (name, description, code, price, category, stock, key_sat) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [
      product.name,
      product.description,
      product.code,
      product.price,
      product.category,
      product.stock,
      product.key_sat,
    ];

    connection.query(query, values, (error, results) => {
      if (error) return reject(error);
      const insertedId = results.insertId;
      resolve({
        message: "Producto Registrado Correctamente",
        id: insertedId,
      });
    });
  });
};

const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM products WHERE status = "Active"',
      (error, results) => {
        if (error) return reject(error);
        resolve(results);
      }
    );
  });
};

const putProductPhoto = (product) => {
  return new Promise((resolve, reject) => {
    const now = new Date();
    const query = "UPDATE products SET  photo= ?, updated_at= ? WHERE id= ?";
    const values = [product.photo, product.updated_at, product.id];

    connection.query(query, values, (error, results) => {
      if (error) return reject(error);
      resolve("Archivo Subido con Éxito");
    });
  });
};

const getProduct = (data) => {
  return new Promise((resolve, reject) => {
    let keys = "";
    let values = [];

    Object.entries(data).forEach(([key, value]) => {
      if (key == "stock") {
        values.push(`${value}`);
        keys += `${key} <= ? OR `;
      } else {
        values.push(`%${value}%`);
        keys += `${key} LIKE ? OR `;
      }
    });

    keys = keys.trim();

    if (keys.endsWith("OR")) {
      keys = keys.substring(0, keys.length - 3);
    }

    const query =
      "SELECT * FROM products WHERE " + keys + " AND status = 'Active'";

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
    const query =
      "UPDATE products SET name= ?, description= ?, code=?, price= ?, category= ?, stock= ?, key_sat=?, updated_at= ? WHERE id= ?";
    const values = [
      product.name,
      product.description,
      product.code,
      product.price,
      product.category,
      product.stock,
      product.key_sat,
      product.updated_at,
      product.id,
    ];

    connection.query(query, values, (error, results) => {
      if (error) return reject(error);
      resolve("Producto Modificado Correctamente");
    });
  });
};

const deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    const now = new Date();
    const query = 'UPDATE products SET status="Deleted" WHERE id= ?';
    const values = [id];

    connection.query(query, values, (error, results) => {
      if (error) return reject(error);
      resolve("Producto Eliminado Correctamente");
    });
  });
};

const getCategories = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT category FROM products GROUP BY category;",
      (error, results) => {
        if (error) return reject(error);
        resolve(results);
      }
    );
  });
};

const getAllKeySatProducts = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM key_products_sat", (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

module.exports = {
  registerProducts,
  getAllProducts,
  putProductPhoto,
  getProduct,
  putProducts,
  deleteProduct,
  getCategories,
  getAllKeySatProducts,
};
