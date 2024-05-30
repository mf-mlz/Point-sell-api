const dotenv = require('dotenv');
dotenv.config();
const Facturapi = require('facturapi').default;
const facturapi = new Facturapi(process.env.FACTURAPI_KEY);

const createInvoice = async () => {

    try {
        const invoice = await facturapi.invoices.create({
            customer: {
                legal_name: 'Dunder Mifflin',
                email: 'email@example.com',
                tax_id: 'ABC101010111',
                tax_system: '601',
                address: {
                    zip: '85900'
                }
            },
            items: [{
                quantity: 2,
                product: {
                    description: 'Ukelele',
                    product_key: '60131324',
                    price: 345.60
                }
            }],
            payment_form: Facturapi.PaymentForm.DINERO_ELECTRONICO,
            folio_number: 914,
            series: 'F'
        });

        return invoice;
    } catch (error) {
        return error;
    }


};



module.exports = {
    createInvoice
};