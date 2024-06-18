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

const sendEmail = async (data) => {
    console.log(data);  

    try {

        const options = { email: data.emails } ;
        await facturapi.invoices.sendByEmail(data.invoiceId, options);
        return true;

    } catch (error) {
        console.error('Error al enviar el correo:', error.response ? error.response.data : error.message);
        return false;
    }

};

module.exports = {
    createInvoice,
    sendEmail
};