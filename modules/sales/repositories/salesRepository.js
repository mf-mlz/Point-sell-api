const connection = require("../../../config/database");
const {
  registerSalesProducts,
} = require("../../salesProducts/repositories/salesProductsRepository");
const {
  getEmployeeIdByName,
} = require("../../employees/repositories/employeesRepository");

const registerSales = async (sale) => {
  try {
    const products = sale.products;
    const arryProducts = [];
    /* Verify Stock Products */
    for (const product of products) {
      const q = "call get_stock_product(?);";
      const v = [product.code];
      const results = await queryDatabase(q, v);

      if (results[0][0].error_message) {
        throw new Error(results[0][0].error_message);
      }

      const arrayP = results[0][0];

      if (arrayP.stock < product.quantity) {
        throw new Error(
          `No hay suficiente stock de producto ${arrayP.name}, solo cuentas con ${arrayP.stock} existencias`
        );
      }

      /* Create Obj Products */
      const objProduct = {
        productId: product.id,
        quantity: product.quantity,
        total: arrayP.price,
      };

      arryProducts.push(objProduct);
    }

    /* Insert Sale in sales Table */
    const totalAmount = arryProducts.reduce((accumulator, item) => {
      return accumulator + item.quantity * item.total;
    }, 0);

    const resultInsertSale = await insertSale(sale, totalAmount, arryProducts);
    return resultInsertSale;
  } catch (error) {
    throw new Error(`Error al registrar la venta: ${error.message}`);
  }
};

/* Function Insert Sale */
const insertSale = async (sale, totalAmount, arryProducts) => {
  return new Promise(async (resolve, reject) => {
    try {
      const customerId = sale.customerId || null;

      // Verificar employeesRepository y obtener el ID del empleado
      const employeesId = await getEmployeeIdByName(sale.employees);
      
      const query =
        "INSERT INTO sales (date, totalAmount, payment, amount, changeAmount, dataPayment, customerId, employeesId, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      
      const date = sale.date;
      const formattedDate = date.toISOString().split("T")[0] + " 00:00:00";
      const values = [
        formattedDate,
        totalAmount,
        sale.payment,
        sale.amount,
        sale.changeAmount,
        sale.dataPayment,
        customerId,
        employeesId[0].id,
        sale.status,
      ];

      connection.query(query, values, async (error, results) => {
        if (error) {
          return reject(error);
        }

        const saleId = results.insertId;

        try {
          // Verificar que arryProducts sea un arreglo antes de mapear
          if (!Array.isArray(arryProducts)) {
            throw new Error("arryProducts debe ser un arreglo");
          }

          const productPromises = arryProducts.map((product) => {
            const dataSaleProducts = {
              salesId: saleId,
              productId: product.productId,
              quantity: product.quantity,
              total: product.total,
            };
            return registerSalesProducts(dataSaleProducts);
          });

          await Promise.all(productPromises);

          // Verificar que sale.products sea un arreglo antes de iterar
          if (!Array.isArray(sale.products)) {
            throw new Error("sale.products debe ser un arreglo");
          }

          for (const product of sale.products) {
            const q = "CALL update_stock(?, ?);";
            const v = [product.code, product.quantity];
            await queryDatabase(q, v);
          }
          
          resolve(saleId);
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
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
    connection.query("CALL get_complete_info_sale()", (error, results) => {
      if (error) return reject(error);
      resolve(results[0]);
    });
  });
};

const getSaleInfoCompleteById = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "CALL GetInfoSalesCompleteById(?)",
      [id],
      (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      }
    );
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

    if (keys.endsWith("OR")) {
      keys = keys.substring(0, keys.length - 2);
    }

    const query =
      "SELECT * FROM sales WHERE " + keys + " AND statusSale = 'Active'";

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
    const query =
      "UPDATE sales SET date= ?, payment=?, dataPayment=?, customerId= ?, employeesId= ?, status= ?, updated_at= ? WHERE id = ?";
    const date = sale.date;
    const formattedDate = date.toISOString().split("T")[0] + " 00:00:00";

    const values = [
      formattedDate,
      sale.payment,
      sale.dataPayment,
      sale.customerId,
      sale.employeesId,
      sale.status,
      sale.updated_at,
      sale.id,
    ];

    connection.query(query, values, (error, results) => {
      if (error) return reject(error);
      resolve("Venta Modificada Correctamente");
    });
  });
};

const deleteSale = (id) => {
  return new Promise((resolve, reject) => {
    const now = new Date();
    const query = 'UPDATE sales SET statusSale = "Deleted" WHERE id= ?';
    const values = [id];

    connection.query(query, values, (error, results) => {
      if (error) return reject(error);
      resolve("Venta Eliminada Correctamente");
    });
  });
};

const postSaleDate = (data) => {
  return new Promise((resolve, reject) => {
    let values = [];
    Object.entries(data).forEach(([key, value]) => {
      values.push(value);
    });

    const k = "date > ? AND date < ?";
    const query =
      " SELECT * FROM sales WHERE " + k + ' AND statusSale = "Active" ;';
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
  postSaleDate,
  getSaleInfoCompleteById,
};
