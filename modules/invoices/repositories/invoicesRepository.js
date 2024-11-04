const connection = require("../../../config/database");
const { createUpdatetAt } = require("../../../utils/helpers");
const fs = require("fs");
const Facturapi = require("facturapi").default;
const facturapi = new Facturapi(process.env.FACTURAPI_KEY);
const {
  getEmployeeIdByName,
} = require("../../employees/repositories/employeesRepository");

const registerInvoice = async (invoice) => {
  return new Promise(async (resolve, reject) => {
    try {
      const id_employee = await getEmployeeIdByName(invoice.employee);

      const query =
        "INSERT INTO invoices(id_sale, id_invoice, folio, id_employee) VALUES (?, ?, ?, ?)";

      const values = [
        invoice.id_sale,
        invoice.id_invoice,
        invoice.folio,
        id_employee[0].id,
      ];

      connection.query(query, values, (error, results) => {
        if (error) {
          console.log(error);
          return resolve(false);
        }
        resolve(true);
      });
    } catch (error) {
      console.log("Error al obtener el ID del empleado:", error);
      resolve(false);
    }
  });
};

const createInvoice = async (invoiceData) => {
  try {
    const invoice = await facturapi.invoices.create(invoiceData);
    return invoice;
  } catch (error) {
    return error.message;
  }
};

const sendEmail = async (data) => {
  try {
    const options = { email: data.emails };
    await facturapi.invoices.sendByEmail(data.invoiceId, options);
    return true;
  } catch (error) {
    console.error(
      "Error al enviar el correo:",
      error.response ? error.response.data : error.message
    );
    return false;
  }
};

const downloadInvoice = async (id_invoice) => {
  const zipStream = await facturapi.invoices.downloadZip(id_invoice);
  return zipStream;
};

const cancelInvoice = async (invoiceData) => {
  try {
    const invoice = await facturapi.invoices.cancel(invoiceData.id_invoice, {
      motive: invoiceData.motive,
    });
    return invoice;
  } catch (error) {
    return error.message;
  }
};

const putStatusInvoice = async (data) => {
  try {
    const id_employee = await getEmployeeIdByName(data.employee);

    /* Lista de Motivos */
    const motives = {
      "01": { descripcion: "Comprobante emitido con errores con relación." },
      "02": { descripcion: "Comprobante emitido con errores sin relación." },
      "03": { descripcion: "No se llevó a cabo la operación." },
      "04": {
        descripcion: "Operación nominativa relacionada en la factura global.",
      },
    };

    return new Promise((resolve, reject) => {
      const query = `
        UPDATE invoices 
        SET status = "Canceled", 
            id_employee_cancel = ?, 
            motive = ?, 
            updated_at = ? 
        WHERE id_invoice = ?;
      `;

      const updated_at = createUpdatetAt();
      const descriptionMotive = motives[data.motive].descripcion;
      const motive = `${data.motive} - ${descriptionMotive}`;
      const values = [id_employee[0].id, motive, updated_at, data.id_invoice];

      connection.query(query, values, (error, results) => {
        if (error) {
          return resolve(false);
        }
        resolve(true);
      });
    });
  } catch (error) {
    console.log("Error al obtener el ID del empleado:", error);
    return false;
  }
};

const getInvoicesByIdSale = (id_sale) => {
  return new Promise((resolve, reject) => {
    const query = "call GetInvoiceDetailsBySaleId(?)";
    const values = [id_sale];
    connection.query(query, values, (error, results) => {
      if (error) return reject(error);
      resolve(results[0]);
    });
  });
};

module.exports = {
  registerInvoice,
  createInvoice,
  sendEmail,
  downloadInvoice,
  cancelInvoice,
  putStatusInvoice,
  getInvoicesByIdSale,
};
