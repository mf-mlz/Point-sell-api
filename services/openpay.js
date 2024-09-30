const { createUpdatetAt } = require("../utils/helpers");
const connection = require("../config/database");
const Openpay = require("openpay");
const openpay = new Openpay(
  process.env.ID_OPENPAY,
  process.env.KEY_PRIV_TEST_OPENPAY,
  false
);

const processPayment = async (req, res) => {
  const data = req.body;

  if (!data.token || !data.amount || !data.description || !data.id_order) {
    return res.status(400).json({
      error: "Faltan datos necesarios para procesar el pago",
    });
  }

  const chargeRequest = {
    source_id: data.token,
    method: "card",
    amount: data.amount,
    currency: "MXN",
    description: data.description,
    order_id: data.id_order,
    device_session_id: data.deviceSessionId,
    customer: {
      name: data.customer.name,
      last_name: data.customer.lastName,
      email: data.customer.email,
    },
  };

  try {
    const charge = await new Promise((resolve, reject) => {
      openpay.charges.create(chargeRequest, (error, charge) => {
        if (error) {
          reject(error);
        } else {
          resolve(charge);
        }
      });
    });

    if (charge.status === "completed") {
      const query = "UPDATE sales SET status= ?, updated_at= ? WHERE id = ?";
      const values = [1, createUpdatetAt(), data.id_order];

      await new Promise((resolve, reject) => {
        connection.query(query, values, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve("Venta Modificada Correctamente");
          }
        });
      });

      return res.status(200).json({
        message: "Venta Pagada con Éxito",
      });
    } else {
      return res.status(400).json({
        error: "El pago no se completó correctamente",
      });
    }
  } catch (err) {
    
    /* Update rejection_reason */
    const query = "UPDATE sales SET rejection_reason = ?, updated_at= ? WHERE id = ?";
    const values = [err.description, createUpdatetAt(), data.id_order];
    await new Promise((resolve, reject) => {
      connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(err.description || "Error al Procesar el Pago de la Venta");
        }
      });
    });

    return res
      .status(err.http_code || 500)
      .json({
        error: err.description || "Error al Procesar el Pago de la Venta",
      });
  }
};

module.exports = {
  processPayment,
};
