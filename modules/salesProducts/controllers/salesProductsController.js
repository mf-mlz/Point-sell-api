const salesProductsService = require("../services/salesProductsService");
const productsService = require("../../products/services/productsService");
const { verifyData, createUpdatetAt } = require("../../../utils/helpers");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

const registerSalesProducts = async (req, res) => {
  const requiredFields = ["salesId", "productId", "quantity"];
  const data = req.body;

  const missingField = verifyData(requiredFields, data);

  if (missingField) {
    return res
      .status(400)
      .json({ error: `El campo ${missingField} es requerido` });
  }

  const { salesId, productId, quantity } = data;

  try {
    const obj = { id: productId };
    const productData = await productsService.getProduct(obj);
    const productPrice = productData[0]?.price;
    data.total = parseFloat(productPrice) * parseFloat(quantity);
    const registerSalesProductsService =
      await salesProductsService.registerSalesProducts(data);
    res.status(201).json({ message: registerSalesProductsService });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const filterSalesProducts = async (req, res) => {
  const data = req.body;
  try {
    delete data.employeeId;
    const salesData = await salesProductsService.getSalesProducts(data);
    if (salesData.length > 0) {
      res.status(401).json({
        message: `Se encontraron ${salesData.length} registros`,
        sales: salesData,
      });
    } else {
      res.status(401).json({ message: `No se encontraron registros` });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Ocurrió un error al obtener los registros" });
  }
};

const filterJoinSalesProducts = async (req, res) => {
  const data = req.body;
  try {
    delete data.employeeId;
    const salesData = await salesProductsService.getSalesJoinProducts(data);
    if (salesData.length > 0) {
      res.status(200).json({
        message: `Se encontraron ${salesData.length} registros`,
        sales: salesData,
      });
    } else {
      res.status(200).json({ message: `No se encontraron registros` });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Ocurrió un error al obtener los registros" });
  }
};

const getAllSalesProducts = async (req, res) => {
  try {
    const salesProducts = await salesProductsService.getAllSalesProducts();
    res.json(salesProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const putSalesProducts = async (req, res) => {
  const requiredFields = ["id", "salesId", "productId", "quantity", "total"];
  const data = req.body;

  const missingField = verifyData(requiredFields, data);
  if (missingField) {
    return res
      .status(400)
      .json({ error: `El campo ${missingField} es requerido` });
  }

  const { id, salesId, productId, quantity, total } = data;

  try {
    data.updated_at = createUpdatetAt();

    const salesProductsServices = await salesProductsService.putSalesProducts(
      data
    );
    res.status(201).json({ message: salesProductsServices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteSalesProducts = async (req, res) => {
  const requiredFields = ["id"];
  const data = req.body;

  const missingField = verifyData(requiredFields, data);
  if (missingField) {
    return res
      .status(400)
      .json({ error: `El campo ${missingField} es requerido` });
  }

  const { id } = data;

  try {
    const deleteSalesProductsServices =
      await salesProductsService.deleteSalesProducts(data);
    res.status(201).json({ message: deleteSalesProductsServices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const generateTicket = async (req, res) => {
  const requiredFields = ["salesId"];
  const data = req.body;
  const missingField = verifyData(requiredFields, data);
  if (missingField) {
    return res
      .status(400)
      .json({ error: `El campo ${missingField} es requerido` });
  }
  const { salesId } = data;

  try {
    delete data.employeeId;

    const id = data.salesId;
    const dataTicket = await salesProductsService.getInfoTicket(id);

    const doc = new PDFDocument({
      size: "A6",
      margins: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      },
    });

    /* Data Ticket */
    const dateSale = dataTicket[0].date_sale
      ? formatDateAndHour(dataTicket[0].date_sale)
      : "";

    const dateCurrently = new Date();
    const day = dateCurrently.getDate();
    const month = dateCurrently.getMonth() + 1;
    const year = dateCurrently.getFullYear();
    const hour = dateCurrently.getHours();
    const minutes = dateCurrently.getMinutes();
    const seconds = dateCurrently.getSeconds();
    const employee = dataTicket[0].employee;
    const cardNumber =
      dataTicket[0].paymentForm !== "Efectivo"
        ? formarCardNumber(dataTicket[0].dataPayment)
        : "";

    /* Header Ticket */
    addCenteredText(doc, "Mi Tiendita", 20);
    addCenteredText(doc, "RFC: ABCD890899", 35);
    addCenteredText(doc, "Av. Las Torres #304 Col. El Venado, CDMX", 50);
    addCenteredText(doc, "Tel. 55-346-78-90", 65);
    doc.fontSize(10).text(`Núm Venta: ${id}`, 30, 90);
    doc.fontSize(10).text(`Atendió: ${employee}`, 160, 90);
    doc.fontSize(10).text(`Fecha: ${dateSale.formattedDate}`, 30, 100);
    doc.fontSize(10).text(`Hora: ${dateSale.formattedTime}`, 160, 100);

    doc
      .fontSize(10)
      .text(
        `Fecha Impresión: ${day}/${month}/${year} ${hour}:${minutes}:${seconds}`,
        40,
        115
      );

    /* Products */
    addCenteredText(doc, "Productos", 130);

    /* Header Products Table */
    doc
      .moveDown()
      .fontSize(10)
      .text("Concepto", 20, 155)
      .text("Cantidad", 120, 155)
      .text("Unitario", 180, 155)
      .text("Total", 240, 155);

    /* Data Products */
    let yPosition = 0;
    dataTicket.forEach((producto, index) => {
      yPosition = 170 + index * 20;

      doc
        .fontSize(10)
        .text(producto.name_product.substring(0, 17), 20, yPosition)
        .text(producto.quantity.toString(), 120, yPosition)
        .text(`$${producto.price_product.toFixed(2)}`, 180, yPosition)
        .text(
          `$${(producto.price_product * producto.quantity).toFixed(2)}`,
          240,
          yPosition
        );
    });

    /* Mounts (Subtotal, Iva, Total) */
    const subtotal = dataTicket[0].total_sale * 0.84;
    const iva = dataTicket[0].total_sale * 0.16;
    const amount = dataTicket[0].amount;
    const changeAmount = dataTicket[0].changeAmount;
    yPosition = yPosition + 35;

    doc
      .moveDown()
      .fontSize(10)
      .text(`SubTotal: $${parseFloat(subtotal.toFixed(2))}`, 177, yPosition);
    yPosition = yPosition + 18;

    doc
      .moveDown()
      .fontSize(10)
      .text(`IVA: $${parseFloat(iva.toFixed(2))}`, 200, yPosition);
    yPosition = yPosition + 18;

    doc
      .moveDown()
      .fontSize(10)
      .text(`Total: $${dataTicket[0].total_sale}`, 200, yPosition);
    yPosition = yPosition + 25;

    /* Amount and ChangeAmount */
    doc
      .moveDown()
      .fontSize(10)
      .text(`Recibido: $${parseFloat(amount.toFixed(2))}`, 190, yPosition);
    yPosition = yPosition + 11.9;

    doc
      .moveDown()
      .fontSize(10)
      .text(`Cambio: $${parseFloat(changeAmount.toFixed(2))}`, 190, yPosition);
    yPosition = yPosition + 20;

    doc
      .moveDown()
      .fontSize(10)
      .text(`Método de Pago: ${dataTicket[0].paymentForm}`, 20, yPosition);
    yPosition = yPosition + 18;

    /* Card Number => Card Payment */
    if (dataTicket[0].paymentForm !== "Efectivo") {
      doc
        .moveDown()
        .fontSize(10)
        .text(`Número de Tarjeta: ${cardNumber}`, 20, yPosition);
      yPosition = yPosition + 18;
    }

    /* Footer */
    let positionY = doc.y;
    addCenteredText(doc, "¡GRACIAS POR TU COMPRA!", positionY + 20);
    doc
      .moveDown()
      .fontSize(8)
      .text(
        `Si deseas facturar tu compra, por favor, solicítalo directamente al Gerente en tienda o al Cajero. Recuerda que, de acuerdo con las normativas del SAT México 4.0, tienes un plazo máximo de 30 días después de la compra para realizar tu solicitud de factura. Para poder facturar, asegúrate de tener a la mano tu ticket de compra y proporciona los datos fiscales necesarios. Si tienes alguna duda sobre el proceso, no dudes en preguntar a nuestro personal, quienes estarán encantados de ayudarte. ¡Gracias por tu preferencia!`,
        20,
        positionY + 40
      );

    doc
      .moveDown()
      .fontSize(8)
      .text(
        `La Reproducción apocrifa de este comprobante constituye en un delito en los términos de las disposiciones fiscales. Este comprobante tendrá vigencia de 2 años apartir de la Fecha de aprobación la Venta, la cual se remarca en el inicio de este comprobante de venta (Fecha y Hora)"`,
        20,
        doc.y + 20
      );

    addCenteredText(doc, "Pago en una sola Exhibición", doc.y + 20);

    try {
      const url = process.env.URL_SALE + id.toString();
      await addQrToPdf(doc, url);
      doc.end();
    } catch (error) {
      console.error(error);
    }

    /* Headers => To Download */
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=ticket.pdf");

    doc.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* Function Centered Text Ticket */
function addCenteredText(doc, text, yPosition) {
  const pageWidth = doc.page.width;
  const textWidth = doc.widthOfString(text);
  const x = (pageWidth - textWidth) / 2;

  doc.fontSize(12).text(text, x, yPosition);
}

/* Format Card Number Ticket */
function formarCardNumber(number) {
  const numberStr = number.toString();
  const lastFourDigits = numberStr.slice(-4);
  const maskedPart = "*".repeat(numberStr.length - 4);
  const formattedNumber = maskedPart + lastFourDigits;

  return formattedNumber.replace(/(\d{4})(?=\d)/g, "$1-").replace(/-$/, "");
}

/* Format Day and Hour Ticket */
function formatDateAndHour(dateString) {
  const date = new Date(dateString);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  const formattedDate = `${day}-${month}-${year}`;
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  return { formattedDate, formattedTime };
}

/* Function Add QR Ticket */
async function addQrToPdf(doc, id) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(id, { errorCorrectionLevel: "H" }, (err, url) => {
      if (err) return reject(err);

      const base64Data = url.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");

      // Agregar imagen QR al PDF
      doc.image(buffer, { width: 100, align: "center", valign: "center" });
      resolve();
    });
  });
}

module.exports = {
  registerSalesProducts,
  filterSalesProducts,
  filterJoinSalesProducts,
  getAllSalesProducts,
  putSalesProducts,
  deleteSalesProducts,
  generateTicket,
};
