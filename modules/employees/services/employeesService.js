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

const getEmployeeAll = (data) => {
    return employeesRepository.getEmployeeAll(data);
};

const putEmployees = (data) => {
    return employeesRepository.putEmployees(data);
};

const deleteEmployee = (data) => {
    return employeesRepository.deleteEmployee(data);
};

module.exports = {
    registerEmployees,
    getAllEmployees,
    getEmployee,
    getEmployeeAll,
    putEmployees,
    deleteEmployee
};