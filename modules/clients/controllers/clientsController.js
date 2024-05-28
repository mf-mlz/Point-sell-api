const clientsService = require('../services/clientService');
const { verifyData } = require('../../../utils/helpers');

const registerClients = async (req, res) => {

    const requiredFields = ['name', 'email', 'phone', 'address'];
    const data = req.body;
    delete data.employeeId;

    const missingField = verifyData(requiredFields, data);

    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }

    // const { name, email, phone, address } = data;

    try {

        const registerClientsServices = await clientsService.registerClients(data);
        res.status(201).json({ message: registerClientsServices });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const filterClients = async (req, res) => {

    const data = req.body;

    try {

        delete data.employeeId;
        const clientData = await clientsService.getClient(data);

        if (clientData.length > 0) {
            res.status(401).json({ message: `Se encontraron ${clientData.length} registros`, client: clientData });
        } else {
            res.status(401).json({ message: `No se encontraron registros` });
        }

    } catch (err) {
        res.status(500).json({ error: 'Ocurrió un error al obtener los registros' });
    }
};

const getAllClients = async (req, res) => {
    try {
        const clients = await clientsService.getAllClients();
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerClients,
    getAllClients,
    filterClients
}