const connection = require('../../../config/database');

const registerEmployees = (employee) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO employees (name, email, password, phone, address, role_id) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [employee.name, employee.email, employee.password, employee.phone, employee.address, employee.role_id];

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve('Usuario Registrado Correctamente');
        });

    });
};

const getAllEmployees = () => {
    return new Promise((resolve, reject) => {
        connection.query('CALL getAllEmployees();', (error, results) => {
            if (error) return reject(error);
            resolve(results[0]);
        });
    });
};

const getEmployee = (data) => {
    return new Promise((resolve, reject) => {

        let keys = "";
        let values = [];

        Object.entries(data).forEach(([key, value]) => {

            values.push(value);
            keys += 'employees.' + key + " = ? OR ";
        });

        keys = keys.trim();

        if (keys.endsWith('OR')) {
            keys = keys.substring(0, keys.length - 2);
        }

        const query = 'SELECT employees.*, roles.name as role_name FROM employees INNER JOIN roles ON employees.role_id = roles.id  WHERE ' + keys + "";

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            const result = JSON.parse(JSON.stringify(results));
            resolve(result);
        });

    });
};

const getEmployeeAll = (data) => {
    return new Promise((resolve, reject) => {
        const aux = '%' + data.search + '%';
        let values = [aux, aux, aux, aux];
        const query = 'SELECT * FROM employees where (name like ? or email like ? or phone like ? or address like ?) and status = "Active";';
        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            const result = JSON.parse(JSON.stringify(results));
            resolve(result);
        });
    });
};

const putEmployees = (employee) => {
    return new Promise((resolve, reject) => {
        const now = new Date();
        const query = 'UPDATE employees SET name= ?, email= ?, phone= ?, address= ?, updated_at= ?, role_id= ? WHERE id= ?';
        const values = [employee.name, employee.email, employee.phone, employee.address, employee.updated_at, employee.role_id, employee.id];

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve('Usuario Modificado Correctamente');
        });

    });
};

const deleteEmployee = (id) => {
    return new Promise((resolve, reject) => {
        const now = new Date();
        const query = 'UPDATE employees SET status="Deleted" WHERE id= ?';
        const values = [id];

        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve('Usuario Eliminado Correctamente');
        });

    });
};

const putEmployeesPs = (employee) => {
    return new Promise((resolve, reject) => {
        console.log(employee);
        const query = 'UPDATE employees SET password= ? WHERE id= ?';
        const values = [employee.password, employee.id];
        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve('Usuario Modificado Correctamente');
        });
    });
};


module.exports = {
    getAllEmployees,
    registerEmployees,
    getEmployee,
    getEmployeeAll,
    putEmployees,
    deleteEmployee,
    putEmployeesPs
};