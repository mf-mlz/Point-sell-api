const invoicesService = require('../services/invoicesService');
const clientService = require('../../clients/services/clientService');
const salesProductsService = require('../../salesProducts/services/salesProductsService');
const { verifyData, createUpdatetAt } = require('../../../utils//helpers');

const createInvoice = async (req, res) => {

    try {

        const data = req.body;
        const requiredFields = ['customer', 'id_sale', 'payment_form'];

        const missingField = verifyData(requiredFields, data);
        if (missingField) {
            return res.status(400).json({ error: `El campo ${missingField} es requerido` });
        }

        const { customer, id_sale, payment_form } = data;

        const objClient = {
            "id": customer
        };

        const customerObj = await createCustomerObj(req, res, objClient);

        const objSale = {
            "salesId": id_sale
        };

        const itemsObj = await createItemsObj(req, res, objSale);

        const invoiceData = {
            customer: customerObj,
            items: itemsObj,
            payment_form: payment_form.toString()
        };

        const responseInvoice = await invoicesService.createInvoice(invoiceData);
        if (typeof responseInvoice === 'string') {
            res.status(500).json({ error: responseInvoice });
        } else {
            res.status(200).json(responseInvoice);
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Ocurrió un error al crear la Factura' });
    }
};

const createCustomerObj = async (req, res, objClient) => {
    let clientInvoice = {};
    const dataClient = await clientService.getClient(objClient);

    if (dataClient.length > 0) {

        let zip = dataClient[0]?.zip;
        let tax_system = dataClient[0]?.tax_system;

        clientInvoice = {
            "legal_name": dataClient[0]?.name,
            "email": dataClient[0]?.email,
            "tax_id": dataClient[0]?.tax_id,
            "tax_system": tax_system.toString(),
            "address": {
                "zip": zip.toString()
            }
        };

        return clientInvoice;

    } else {
        return res.status(404).json({ error: 'Cliente no registrado' });
    }

};

const createItemsObj = async (req, res, objSale) => {
    let salesProductsInvoice = [];
    const dataSaleProducts = await salesProductsService.getSalesJoinProducts(objSale);

    if (dataSaleProducts.length > 0) {

        dataSaleProducts.forEach(function (data) {

            let obj = {
                quantity: data.quantity,
                product: {
                    description: data.descripcion,
                    product_key: data.key_sat,
                    price: data.price
                }
            };

            salesProductsInvoice.push(obj);

        });

        return salesProductsInvoice;

    } else {
        return res.status(404).json({ error: 'Productos de venta no registrados' });
    }



};

module.exports = {
    createInvoice
}