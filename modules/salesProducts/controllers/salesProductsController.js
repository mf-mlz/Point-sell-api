
const salesProductsService = require('../services/salesProductsService');
const productsService = require('../../products/services/productsService');
const { verifyData, createUpdatetAt } = require('../../../utils/helpers');
const dotenv = require('dotenv');
const PDFDocument = require('pdfkit');

dotenv.config();

const registerSalesProducts = async (req, res) => {

    const requiredFields = ['salesId', 'productId', 'quantity'];
    const data = req.body

    const missingField = verifyData(requiredFields, data);

    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    const { salesId, productId, quantity } = data;

    try {

        const obj = { id: productId }
        const productData = await productsService.getProduct(obj);
        const productPrice = productData[0]?.price;
        data.total = parseFloat(productPrice) * parseFloat(quantity);
        const registerSalesProductsService = await salesProductsService.registerSalesProducts(data);
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
            res.status(401).json({ message: `Se encontraron ${salesData.length} registros`, sales: salesData });

        } else {
            res.status(401).json({ message: `No se encontraron registros` });
        }

    } catch (err) {
        res.status(500).json({ error: 'Ocurrió un error al obtener los registros' });
    }

};

const filterJoinSalesProducts = async (req, res) => {

    const data = req.body;
    try {
        delete data.employeeId;
        const salesData = await salesProductsService.getSalesJoinProducts(data);
        if (salesData.length > 0) {
            res.status(401).json({ message: `Se encontraron ${salesData.length} registros`, sales: salesData });

        } else {
            res.status(401).json({ message: `No se encontraron registros` });
        }

    } catch (err) {
        res.status(500).json({ error: 'Ocurrió un error al obtener los registros' });
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

    const requiredFields = ['id', 'salesId', 'productId', 'quantity', 'total'];
    const data = req.body;

    const missingField = verifyData(requiredFields, data);
    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    const { id, salesId, productId, quantity, total } = data;

    try {

        data.updated_at = createUpdatetAt();

        const salesProductsServices = await salesProductsService.putSalesProducts(data);
        res.status(201).json({ message: salesProductsServices });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteSalesProducts = async (req, res) => {

    const requiredFields = ['id'];
    const data = req.body;

    const missingField = verifyData(requiredFields, data);
    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    const { id } = data;

    try {

        const deleteSalesProductsServices = await salesProductsService.deleteSalesProducts(data);
        res.status(201).json({ message: deleteSalesProductsServices });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const generateTicket = async (req, res) => {

    const requiredFields = ['salesId'];
    const data = req.body
    const missingField = verifyData(requiredFields, data);
    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }
    const { salesId } = data;



    try {
        delete data.employeeId;

        const id1 = data.salesId;
        const dataTicket = await salesProductsService.getInfoTicket(id1);

        console.log(dataTicket);

        const doc = new PDFDocument({ size: 'A6' });

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

        // Encabezado del documento
        doc
            .fontSize(12)
            .text('Tiendita xD', 20, 20);
        // Datos del cliente
        doc
            .fontSize(10)
            .text(`Num.: ${cliente}`, 20, 40);

        doc
            .fontSize(10)
            .text(`Cajero: ${cajero}`, 120, 40);

        doc
            .fontSize(10)
            .text(`Fecha: ${dia}/${mes}/${anio}`, 20, 60);
        doc
            .fontSize(10)
            .text(`Hora: ${horas}:${minutos}:${segundos}`, 120, 60);

        // Tabla de productos
        doc
            .moveDown()
            .fontSize(10)
            .text('Productos:', 20, 80);

        dataTicket.forEach((producto, index) => {
            texto = `${index + 1}. ${producto.name_product.substring(0, 20) + '...'}`;
            doc
                .moveDown()
                .fontSize(10)
                .text(texto.toUpperCase(), 30, 100 + index * 20);
        });

        dataTicket.forEach((producto, index) => {
            texto = `$${producto.price_product}`;
            doc
                .moveDown()
                .fontSize(10)
                .text(texto.toUpperCase(), 185, 100 + index * 20);
        });

        // SubTotal
        doc.moveDown()
            .fontSize(10)
            .text(`SubTotal: $${(dataTicket[0].total_sale * 0.84)}`, 50, 160);
        // Iva
        doc.moveDown()
            .fontSize(10)
            .text(`IVA: $${(dataTicket[0].total_sale * 0.16)}`, 50, 180);
        // Total
        doc.moveDown()
            .fontSize(10)
            .text(`Total: $${dataTicket[0].total_sale}`, 50, 200);



        // Metodo de Pago
        doc.moveDown()
            .fontSize(10)
            .text(`Método de Pago: $${pay}`, 20, 220);
        // Metodo de Pago
        doc.moveDown()
            .fontSize(10)
            .text(`Número de Tarjeta: **** **** **** $${numcar}`, 20, 230);
        // autorizacion
        doc.moveDown()
            .fontSize(10)
            .text(`Autorización: $${autorizacion}`, 20, 240);

        // Thanks
        doc.moveDown()
            .fontSize(8)
            .text(`¡Gracias por su compra!`, 20, 260);

        // footer
        doc.moveDown()
            .fontSize(8)
            .text(`Tienda XYZ`, 20, 280);
        // footer
        doc.moveDown()
            .fontSize(8)
            .text(`Calle Principal 123, Ciudad, País`, 20, 290);
        // footer
        doc.moveDown()
            .fontSize(8)
            .text(`+1 234 567 8900`, 20, 300);
        // footer
        doc.moveDown()
            .fontSize(8)
            .text(`www.tiendaxyz.com`, 20, 310);



        // Finalizar y cerrar el documento
        doc.end();

        // Establecer encabezado para descarga de PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=ticket.pdf');

        // Enviar el PDF generado como respuesta
        doc.pipe(res);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    registerSalesProducts,
    filterSalesProducts,
    filterJoinSalesProducts,
    getAllSalesProducts,
    putSalesProducts,
    deleteSalesProducts,
    generateTicket
};