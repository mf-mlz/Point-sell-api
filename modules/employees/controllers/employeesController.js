const employeesService = require("../services/employeesService");
const passwordService = require("../services/passwordService");
const { verifyData, createUpdatetAt } = require("../../../utils/helpers");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

/* Key ECDSA (ES256) */
const pKey = fs.readFileSync(path.join(process.cwd(), process.env.KN), 'utf8');

dotenv.config();
const registerEmployees = async (req, res) => {
  const requiredFields = [
    "name",
    "email",
    "password",
    "phone",
    "address",
    "role_id",
  ];
  const data = req.body;

  const missingField = verifyData(requiredFields, data);
  if (missingField) {
    return res
      .status(400)
      .json({ error: `El campo ${missingField} es requerido` });
  }

  const { name, email, password, phone, address, role_id } = data;

  try {
    const hashedPassword = await passwordService.hashPassword(password);
    data.password = hashedPassword;

    const registerEmployeesServices = await employeesService.registerEmployees(
      data
    );
    res.status(200).json({ message: registerEmployeesServices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const filterEmployees = async (req, res) => {
  const data = req.body;
  try {
    delete data.employeeId;
    const employeeData = await employeesService.getEmployee(data);
    if (employeeData.length > 0) {
      res
        .status(200)
        .json({
          message: `Se encontraron ${employeeData.length} registros`,
          employee: employeeData,
        });
    } else {
      res.status(200).json({ message: `No se encontraron registros` });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Ocurrió un error al obtener los registros" });
  }
};
const filterEmployeesAll = async (req, res) => {
  const data = req.body;
  try {
    const employeeData = await employeesService.getEmployeeAll(data);
    if (employeeData.length > 0) {
      res
        .status(200)
        .json({
          message: `Se encontraron ${employeeData.length} registros`,
          employee: employeeData,
        });
    } else {
      res.status(200).json({ message: `No se encontraron registros` });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Ocurrió un error al obtener los registros" });
  }
};

const loginEmployees = async (req, res) => {
  const requiredFields = ["email", "password"];
  const data = req.body;

  const missingField = verifyData(requiredFields, data);
  if (missingField) {
    return res
      .status(400)
      .json({ error: `El campo ${missingField} es requerido` });
  }

  const { email, password } = data;

  try {
    const searchData = { email: email };
    const employeeData = await employeesService.getEmployee(searchData);

    if (employeeData.length > 0) {
      const verifyPassword = await passwordService.verifyPassword(
        password,
        employeeData[0].password
      );
      if (verifyPassword) {
        const payload = {
          id: employeeData[0].id,
          name: employeeData[0].name,
          email: employeeData[0].email,
          phone: employeeData[0].phone,
          role_id: employeeData[0].role_id,
          role_name: employeeData[0].role_name,
        };

        const options = {
          algorithm: "ES256",
          expiresIn: "9h",
        };

        const token = jwt.sign(payload, pKey, options);

        res.cookie("token", token, {
          httpOnly: true, 
          secure: true, 
          maxAge: 9 * 60 * 60 * 1000, 
          sameSite: "Strict", 
        });

        res
          .status(200)
          .json({ message: `Inicio de sesión exitoso`, token });
      } else {
        res
          .status(401)
          .json({
            message: ` La contraseña del correo ${email} es incorrecta.`,
          });
      }
    } else {
      res.status(404).json({ message: `El correo ${email} no existe` });
    }
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

const putEmployees = async (req, res) => {
  const requiredFields = ["id", "name", "email", "phone", "address", "role_id"];
  const data = req.body;

  const missingField = verifyData(requiredFields, data);
  if (missingField) {
    return res
      .status(400)
      .json({ error: `El campo ${missingField} es requerido` });
  }

  const { id, name, email, password, phone, address, role_id } = data;

  try {
    data.updated_at = createUpdatetAt();

    const registerEmployeesServices = await employeesService.putEmployees(data);
    res.status(200).json({ message: registerEmployeesServices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEmployee = async (req, res) => {
  const requiredFields = ["id"];
  const data = req.body;

  const missingField = verifyData(requiredFields, data);
  if (missingField) {
    return res
      .status(200)
      .json({ error: `El campo ${missingField} es requerido` });
  }

  const { id } = data;

  try {
    const deleteEmployeeServices = await employeesService.deleteEmployee(data);
    res.status(200).json({ message: deleteEmployeeServices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllEmployees,
  registerEmployees,
  loginEmployees,
  filterEmployees,
  filterEmployeesAll,
  putEmployees,
  deleteEmployee,
};
