const employeesService = require('../modules/employees/services/employeesService');
const dotenv = require('dotenv');

dotenv.config();

const verifyAdminRole = async (req, res, next) => {
    try {
        const idUser = req.body.employeeId;
        const data = { "id" : idUser };

        const employeeData = await employeesService.getEmployee(data);
        const nameRole = employeeData[0]?.role_name;

        if (nameRole === undefined) {
            return res.status(401).json({ message: 'Acceso Denegado: El ID del Empleado no es Válido' });
        } else if (nameRole !== process.env.ROLE_NAME) {
            return res.status(401).json({ message: 'Acceso Denegado: No cuentas con los permisos necesarios para realizar esta acción.' });
        }

        next();
    } catch (err) {
        res.status(400).json({ message: 'Acceso Inválido' });
    }
};


module.exports = {
    verifyAdminRole
};