const invoicesService = require('../services/invoicesService');

const createInvoice = async (req, res) => {
    try {
        console.log(req.body);
        const responseData = await invoicesService.createInvoice();
        res.status(200).json({ message: responseData });
    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error al crear la Factura' });
    }
};


module.exports = {
    createInvoice
}