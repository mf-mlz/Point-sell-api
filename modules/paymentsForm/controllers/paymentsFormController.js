const paymentsFormService = require('../services/paymentsFormService');
const { verifyData, createUpdatetAt } = require('../../../utils/helpers');

const getAllPaymentsForm = async (req, res) => {
    try {
        const paymentsForm = await paymentsFormService.getAllPaymentsForm();
        return res.json(paymentsForm);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const filterPaymentsForm = async (req, res) => {

    const data = req.body;
    try {
        delete data.employeeId;
        const paymentsFormData = await paymentsFormService.getPaymentsForm(data);

        if (paymentsFormData.length > 0) {
            return res.status(401).json({
                message: `Se encontraron ${paymentsFormData.length} registros`,
                paymentForm: paymentsFormData
            });

        } else {
            return res.status(401).json({ message: `No se encontraron registros` });
        }

    } catch (err) {
        return res.status(500).json({ error: 'Ocurrió un error al obtener los registros' });
    }
};

const registerPaymentsForm = async (req, res) => {

    const requiredFields = ['descripcion'];
    const data = req.body;

    delete data.employeeId;

    const missingField = verifyData(requiredFields, data);

    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    try {
        const registerPaymentsFormServices = await paymentsFormService.registerPaymentsForm(data);
        return res.status(201).json({ message: registerPaymentsFormServices });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const putPaymentsForm = async (req, res) => {

    const requiredFields = ["id", 'descripcion'];

    const data = req.body;

    const missingField = verifyData(requiredFields, data);
    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    const { id, descripcion } = data;

    try {

        data.updated_at = createUpdatetAt();

        const registerPaymentsFormServices = await paymentsFormService.putPaymentsForm(data);
        return res.status(201).json({ message: registerPaymentsFormServices });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const deletePaymentsForm = async (req, res) => {

    const requiredFields = ['id'];
    const data = req.body;

    const missingField = verifyData(requiredFields, data);
    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    const { id } = data;

    try {

        const deletePaymentsFormServices = await paymentsFormService.deletePaymentsForm(data);
        return res.status(201).json({ message: deletePaymentsFormServices });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllPaymentsForm,
    filterPaymentsForm,
    registerPaymentsForm,
    putPaymentsForm,
    deletePaymentsForm
};