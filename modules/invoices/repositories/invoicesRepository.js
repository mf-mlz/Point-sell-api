const dotenv = require('dotenv');
dotenv.config();
const Facturapi = require('facturapi').default;
const facturapi = new Facturapi(process.env.FACTURAPI_KEY);

const createInvoice = async (invoiceData) => {

    try {
        const invoice = await facturapi.invoices.create(invoiceData);
        return invoice;
    } catch (error) {
        return error.message;
    }

};



module.exports = {
    createInvoice
};