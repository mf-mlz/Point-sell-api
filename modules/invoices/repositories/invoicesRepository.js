const connection = require("../../../config/database");
const { createUpdatetAt } = require("../../../utils/helpers");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const Facturapi = require("facturapi").default;
const facturapi = new Facturapi(process.env.FACTURAPI_KEY);

const registerInvoice = (invoice) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO invoices(id_sale, id_invoice, folio, id_employee) VALUES (?, ?, ?, ?)";
    const values = [
      invoice.id_sale,
      invoice.id_invoice,
      invoice.folio,
      invoice.id_employee,
    ];

    connection.query(query, values, (error, results) => {
      if (error) {
        console.log(error);

        return resolve(false);
      }
      resolve(true);
    });
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

const putStatusInvoice = (data) => {
  /* List Motives */
  const motives = {
    "01": {
      descripcion: "Comprobante emitido con errores con relación.",
    },
    "02": {
      descripcion: "Comprobante emitido con errores sin relación.",
    },
    "03": {
      descripcion: "No se llevó a cabo la operación.",
    },
    "04": {
      descripcion: "Operación nominativa relacionada en la factura global.",
    },
  };

  return new Promise((resolve, reject) => {
    const now = new Date();
    const query =
      'UPDATE invoices SET status= "Canceled", id_employee_cancel = ?, motive = ?, updated_at= ? WHERE id_invoice= ?;';
    const updated_at = createUpdatetAt();
    const descriptionMotive = motives[data.motive].descripcion;
    const motive = data.motive + " - " + descriptionMotive;
    const values = [data.id_employee, motive, updated_at, data.id_invoice];

    connection.query(query, values, (error, results) => {
      if (error) {
        return resolve(false);
      }
      resolve(true);
    });
  });
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
