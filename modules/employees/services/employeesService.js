const employeesRepository = require('../repositories/employeesRepository');

const registerEmployees = (employee) => {
    return employeesRepository.registerEmployees(employee);
};
const getAllEmployees = () => {
    return employeesRepository.getAllEmployees();
};

const getEmployee = (data) => {
    return employeesRepository.getEmployee(data);
};

const putEmployees = (data) => {
    return employeesRepository.putEmployees(data);
};

module.exports = {
    registerEmployees,
    getAllEmployees,
    getEmployee,
    putEmployees
};