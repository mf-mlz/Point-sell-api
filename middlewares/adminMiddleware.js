const employeesService = require("../modules/employees/services/employeesService");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { decryptCrypt } = require("../utils/crypto-js");

dotenv.config();

const verifyRootUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    let payload = jwt.decode(token);
    payload = decryptCrypt(payload.data);
    const data = { id: payload.id };

    const employeeData = await employeesService.getEmployee(data);
    const nameRole = employeeData[0]?.role_name;

    if (nameRole === undefined) {
      return res
        .status(401)
        .json({ message: "Acceso Denegado: El ID del Empleado no es Válido" });
    } else if (nameRole !== process.env.ROLE_NAME) {
      return res
        .status(401)
        .json({
          message:
            "Acceso Denegado: No cuentas con los permisos necesarios para realizar esta acción.",
        });
    }

    next();
  } catch (err) {
    res.status(400).json({ message: "Acceso Inválido" });
  }
};

const verifyRolSaleRegister = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    let payload = jwt.decode(token);
    
    payload = decryptCrypt(payload.data);
    const data = { id: payload.id };

    const employeeData = await employeesService.getEmployee(data);
    const nameRole = employeeData[0]?.role_name;

    if (nameRole === undefined) {
      return res
        .status(401)
        .json({ message: "Acceso Denegado: El ID del Empleado no es Válido" });
    } else if (
      nameRole !== process.env.ROLE_REGISTER &&
      nameRole !== process.env.ROLE_NAME
    ) {
      return res
        .status(401)
        .json({
          message:
            "Acceso Denegado: No cuentas con los permisos necesarios para realizar esta acción.",
        });
    }

    next();
  } catch (err) {
    console.log(err);

    res.status(400).json({ message: "Acceso Inválido" });
  }
};

module.exports = {
  verifyRootUser,
  verifyRolSaleRegister,
};
