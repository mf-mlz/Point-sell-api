const salesProductsService = require("../services/salesProductsService");
const productsService = require("../../products/services/productsService");
const { verifyData, createUpdatetAt } = require("../../../utils/helpers");
const dotenv = require("dotenv");
const PDFDocument = require("pdfkit");

dotenv.config();

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

    const id1 = data.salesId;
    const dataTicket = await salesProductsService.getInfoTicket(id1);

    const doc = new PDFDocument({
      size: "A6",
      margins: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      },
    });

    // Datos del ticket

    const fechaActual = new Date();

    // Obtener la fecha y hora en formato legible
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1; // Los meses van de 0 a 11
    const anio = fechaActual.getFullYear();
    const horas = fechaActual.getHours();
    const minutos = fechaActual.getMinutes();
    const segundos = fechaActual.getSeconds();

    const cliente = "#56789";
    const cajero = dataTicket[0].employee;
    const pay = "Tarjeta de Crédito";
    const numcar = "1234";
    const autorizacion = "678912";

    const cantidad = 1000;

    // Encabezado del documento
    let y = 0;
    doc.fontSize(12).text("Mi Tiendita", 20, 20);
    // Datos del cliente
    doc.fontSize(10).text(`Num.: ${cliente}`, 20, 40);

    doc.fontSize(10).text(`Cajero: ${cajero}`, 120, 40);

    doc.fontSize(10).text(`Fecha: ${dia}/${mes}/${anio}`, 20, 60);
    doc.fontSize(10).text(`Hora: ${horas}:${minutos}:${segundos}`, 120, 60);

    // Tabla de productos
    doc.moveDown().fontSize(10).text("Productos:", 20, 80);

    // Encabezado de la tabla
    doc
      .moveDown()
      .fontSize(10)
      .text("Concepto", 20, 100)
      .text("Cantidad", 120, 100)
      .text("Unitario", 180, 100)
      .text("Total", 240, 100);

    // Datos de los productos
    dataTicket.forEach((producto, index) => {
      const yPosition = 120 + index * 20;

      doc
        .fontSize(10)
        .text(producto.name_product.substring(0, 17), 20, yPosition) // Concepto
        .text(producto.quantity.toString(), 120, yPosition) // Cantidad
        .text(`$${producto.price_product.toFixed(2)}`, 180, yPosition) // Unitario
        .text(
          `$${(producto.price_product * producto.quantity).toFixed(2)}`,
          240,
          yPosition
        ); // Total
    });

    // SubTotal
    const subtotal = dataTicket[0].total_sale * 0.84;
    const iva = dataTicket[0].total_sale * 0.16;

    doc
      .moveDown()
      .fontSize(10)
      .text(`SubTotal: $${parseFloat(subtotal.toFixed(2))}`, 177, 180);
    // Iva
    doc
      .moveDown()
      .fontSize(10)
      .text(`IVA: $${parseFloat(iva.toFixed(2))}`, 200, 200);
    // Total
    doc
      .moveDown()
      .fontSize(10)
      .text(`Total: $${dataTicket[0].total_sale}`, 200, 220);

    if (dataTicket[0].paymentForm === "Efectivo") {
      // Metodo de Pago
      doc
        .moveDown()
        .fontSize(10)
        .text(`Método de Pago: ${dataTicket[0].paymentForm}`, 20, 250);
      //
      doc.moveDown().fontSize(10).text(`Pagado: $${cantidad}`, 20, 265);
      //
      doc
        .moveDown()
        .fontSize(10)
        .text(`Cambio: $${cantidad - dataTicket[0].total_sale}`, 20, 280);
      /* Card Payment */
    } else {
      // Metodo de Pago
      doc.moveDown().fontSize(10).text(`Método de Pago: ${dataTicket[0].paymentForm}`, 20, 300);
      // Metodo de Pago
      doc
        .moveDown()
        .fontSize(10)
        .text(`Número de Tarjeta: **** **** **** $${numcar}`, 20, 330);
      // autorizacion
      doc
        .moveDown()
        .fontSize(10)
        .text(`Autorización: $${autorizacion}`, 20, 350);
    }

    // Thanks
    doc.moveDown().fontSize(8).text(`¡Gracias por su compra!`, 20, 380);

    // footer
    doc.moveDown().fontSize(8).text(`Tienda XYZ`, 20, 400);
    // footer
    doc
      .moveDown()
      .fontSize(8)
      .text(`Calle Falsa #123 Col. Falsa, México DF`, 20, 430);
    // footer
    doc.moveDown().fontSize(8).text(`(+52) 7714334090`, 20, 450);
    // footer
    doc.moveDown().fontSize(8).text(`www.mitiendita.com.mx`, 20, 470);

    // Finalizar y cerrar el documento
    doc.end();

    // Establecer encabezado para descarga de PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=ticket.pdf");

    // Enviar el PDF generado como respuesta
    doc.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerSalesProducts,
  filterSalesProducts,
  filterJoinSalesProducts,
  getAllSalesProducts,
  putSalesProducts,
  deleteSalesProducts,
  generateTicket,
};
