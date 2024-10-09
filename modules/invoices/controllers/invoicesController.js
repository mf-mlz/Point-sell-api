const invoicesService = require("../services/invoicesService");
const clientService = require("../../clients/services/clientService");
const salesProductsService = require("../../salesProducts/services/salesProductsService");
const salesService = require("../../sales/services/salesService");
const { verifyData, createUpdatetAt } = require("../../../utils//helpers");

const createInvoice = async (req, res) => {
  try {
    const data = req.body;
    const requiredFields = ["customer", "id_sale"];

    const missingField = verifyData(requiredFields, data);
    if (missingField) {
      return res
        .status(400)
        .json({ error: `El campo ${missingField} es requerido` });
    }

    const { customer, id_sale, id_employee } = data;

    const objClient = {
      id: customer,
    };

    const customerObj = await createCustomerObj(req, res, objClient);

    const objSale = {
      salesId: id_sale,
    };

    const objSales = {
      id: id_sale,
    };

    /* Get Payment Form by Id Sale */
    const paymentFormSale = await salesService.getSale(objSales);
    const paymentForm =
      formatNumberToTwoDigits(paymentFormSale[0].payment) || "01";

    const itemsObj = await createItemsObj(req, res, objSale);

    const invoiceData = {
      customer: customerObj,
      items: itemsObj,
      payment_form: paymentForm.toString(),
    };

    const responseInvoice = await invoicesService.createInvoice(invoiceData);
    if (typeof responseInvoice === "string") {
      res.status(500).json({ error: responseInvoice });
    } else {
      /* Add Info in Table Invoices */
      const dataInsert = {
        id_sale: id_sale,
        id_invoice: responseInvoice.id,
        folio: responseInvoice.series + responseInvoice.folio_number,
        id_employee: id_employee,
      };
      const registerInvoice = await invoicesService.registerInvoice(dataInsert);

      if (registerInvoice) {
        res.status(200).json({ message: "Factura Generada con Éxito" });
      } else {
        res
          .status(500)
          .json({ error: "Ocurrió un error al registrar la Factura" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Ocurrió un error al crear la Factura" });
  }
};

const createCustomerObj = async (req, res, objClient) => {
  let clientInvoice = {};
  const dataClient = await clientService.getClient(objClient);

  if (dataClient.length > 0) {
    let zip = dataClient[0]?.zip;
    let tax_system = dataClient[0]?.tax_system;

    clientInvoice = {
      legal_name: dataClient[0]?.name,
      email: dataClient[0]?.email,
      tax_id: dataClient[0]?.tax_id,
      tax_system: tax_system.toString(),
      address: {
        zip: zip.toString(),
      },
    };

    return clientInvoice;
  } else {
    return res.status(500).json({ error: "Cliente no registrado" });
  }
};

const createItemsObj = async (req, res, objSale) => {
  let salesProductsInvoice = [];
  const dataSaleProducts = await salesProductsService.getSalesJoinProducts(
    objSale
  );

  if (dataSaleProducts.length > 0) {
    dataSaleProducts.forEach(function (data) {
      let obj = {
        quantity: data.quantity,
        product: {
          description: data.descripcion,
          product_key: data.key_sat,
          price: data.price,
        },
      };

      salesProductsInvoice.push(obj);
    });

    return salesProductsInvoice;
  } else {
    return res.status(404).json({ error: "Productos de venta no registrados" });
  }
};

const sendEmail = async (req, res) => {
  const { invoiceId, emails } = req.body;

  if (!invoiceId || !emails || (Array.isArray(emails) && emails.length === 0)) {
    return res.status(400).send({ error: "invoiceId y emails son requeridos" });
  }

  const data = req.body;
  try {
    const responseSendEmail = await invoicesService.sendEmail(data);
    if (responseSendEmail) {
      res.status(200).send({ message: "Correo enviado" });
    } else {
      res.status(500).send({ error: "Error al enviar el correo" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Ocurrió un error al enviar la Factura" });
  }
};

/* Download Invoice */
const downloadInvoice = async (req, res) => {
  try {
    const id_invoice = req.params.idInvoice;

    const zipStream = await invoicesService.downloadInvoice(id_invoice);
    res.setHeader("Content-Disposition", "attachment; filename=factura.zip");
    res.setHeader("Content-Type", "application/zip");
    zipStream.pipe(res);

    zipStream.on("end", () => {
      console.log("Archivo ZIP enviado correctamente al cliente");
    });

    zipStream.on("error", (err) => {
      res.status(500).send("Error al descargar el archivo");
    });
  } catch (error) {
    res.status(500).json({ error: "Ocurrió un error al descargar la Factura" });
  }
};

const cancelInvoice = async (req, res) => {
  const data = req.body;

  try {
    const response = await invoicesService.cancelInvoice(data);
    if (response.cancellation_status == "accepted") {
      /* Modificamos los Campos de Status de la Factura */
      const responsePut = await invoicesService.putStatusInvoice(data);
      if (responsePut) {
        res.status(200).json({ message: "Factura Cancelada con Éxito" });
      } else {
        res.status(500).json({
          message: "Ocurrió un error al Cancelar la Factura en el Registro",
        });
      }
    } else {
      res.status(500).json({ error: response });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const getInvoicesByIdSale = async (req, res) => {
  const data = req.params.idSale;

  try {
    const response = await invoicesService.getInvoicesByIdSale(data);

    if (response.length > 0) {
      res.status(200).json({
        message: `Se encontraron ${response.length} registros`,
        invoices: response,
      });
    } else {
      res.status(200).json({ message: `No se encontraron registros` });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

/* Functions */
function formatNumberToTwoDigits(num) {
  return num.toString().padStart(2, "0");
}

module.exports = {
  createInvoice,
  sendEmail,
  downloadInvoice,
  cancelInvoice,
  getInvoicesByIdSale,
};
