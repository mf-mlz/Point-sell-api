const employeesService = require('../services/employeesService');
const passwordService = require('../services/passwordService');
const { verifyData }  = require('../../../utils/helpers');

const registerEmployees = async (req, res) => {
    
    const requiredFields = ['name', 'email', 'password', 'phone', 'address'];
    const data = req.body;

    const missingField = verifyData(requiredFields, data);
    if (missingField) {
        return res.status(400).json({ error: `El campo ${missingField} es requerido` });
    }
    
    const { name, email, password, phone, address } = data;

    try {

        const hashedPassword = await passwordService.hashPassword(password);
        data.password = hashedPassword;

        const registerEmployeesServices = await employeesService.registerEmployees(data);
        res.status(201).json({ message: registerEmployeesServices });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const employees = await employeesService.getAllEmployees();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllEmployees,
    registerEmployees
};