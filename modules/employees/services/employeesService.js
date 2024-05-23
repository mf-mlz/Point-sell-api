const employeesRepository = require('../repositories/employeesRepository');

const registerEmployees = (employee) => {
    return employeesRepository.registerEmployees(employee);
};

const getAllEmployees = () => {
    return employeesRepository.getAllEmployees();
};

module.exports = {
    registerEmployees,
    getAllEmployees
};