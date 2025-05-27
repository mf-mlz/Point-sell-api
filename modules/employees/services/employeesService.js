const employeesRepository = require('../repositories/employeesRepository');

const registerEmployees = (employee) => {
    return employeesRepository.registerEmployees(employee);
};

const checkEmailSend = (data) => {
    return employeesRepository.checkEmailSend(data);
};

const getAllEmployees = () => {
    return employeesRepository.getAllEmployees();
};

const getEmployee = (data) => {
    return employeesRepository.getEmployee(data);
};

const getEmailLogStatusById = (data) => {
    return employeesRepository.getEmailLogStatusById(data);
};

const getEmployeeEmail = (data) => {
    return employeesRepository.getEmployeeEmail(data);
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

const putEmployeesPs = (data, idLog) => {
    return employeesRepository.putEmployeesPs(data, idLog);
};

const putEmployeePhoto = (data) => {
    return employeesRepository.putEmployeePhoto(data);
};

const putUpdateEmailLogToken = (data) => {
    return employeesRepository.putUpdateEmailLogToken(data);
};

module.exports = {
    registerEmployees,
    checkEmailSend,
    getAllEmployees,
    getEmployee,
    getEmployeeEmail,
    getEmployeeAll,
    getEmailLogStatusById,
    putEmployees,
    deleteEmployee,
    putEmployeesPs,
    putEmployeePhoto,
    putUpdateEmailLogToken
};