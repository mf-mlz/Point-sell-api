const paymentsFormService = require('../services/paymentsFormService');
const { verifyData, createUpdatetAt } = require('../../../utils/helpers');

const getAllPaymentsForm = async (req, res) => {
    try {
        const paymentsForm = await paymentsFormService.getAllPaymentsForm();
        res.json(paymentsForm);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const filterPaymentsForm = async (req, res) => {

    const data = req.body;
    try {
        console.log(data);
        delete data.employeeId;
        const paymentsFormData = await paymentsFormService.getPaymentsForm(data);

        if (paymentsFormData.length > 0) {
            res.status(401).json({
                message: `Se encontraron ${paymentsFormData.length} registros`,
                paymentForm: paymentsFormData
            });

        } else {
            res.status(401).json({ message: `No se encontraron registros` });
        }

    } catch (err) {
        res.status(500).json({ error: 'Ocurrió un error al obtener los registros' });
    }
};

module.exports = {
    getAllPaymentsForm,
    filterPaymentsForm,
};