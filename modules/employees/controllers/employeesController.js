const employeesService = require("../services/employeesService");
const passwordService = require("../services/passwordService");
const { verifyData, createUpdatetAt } = require("../../../utils/helpers");
const permissionsController = require("../../permissions/controllers/permissionsController");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const nodemailer = require('nodemailer');
const { encryptCrypt, decryptCrypt } = require("../../../utils/crypto-js");
const nodemailer = require('nodemailer');
const { sendSms, generateCodeAuthSms } = require("../../../services/twilio");

/* Key ECDSA (ES256) */
const pKey = fs.readFileSync(path.join(process.cwd(), process.env.KN), "utf8");

const transporter = nodemailer.createTransport({
  host: process.env.SERVICE_NODE,
  port: process.env.PORT_NODE,
  secure: process.env.SECURITY_NODE, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_NODE,
    pass: process.env.PW_NODE,
  },
});

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

const getEmployee = async (req, res) => {
  const data = req.body;
  try {
    delete data.employeeId;
    const employeeData = await employeesService.getEmployee(data);
    if (employeeData.length > 0) {
      res.status(200).json({
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
      res.status(200).json({
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

const login = async (req, res) => {
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
          role_name: employeeData[0].role_name,
        };

        const payloadEncrypt = encryptCrypt(JSON.stringify(payload));

        const options = {
          algorithm: "ES256",
          expiresIn: "7d",
        };

        const token = jwt.sign(
          {
            data: payloadEncrypt,
          },
          pKey,
          options
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'development' ? false : true /* Production => true */,
          sameSite: "Lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        });

        /* Code SMS */
        const code = await generateCodeAuthSms();

        /* Auth SMS => env development not Send SMS and console.log(code) */
        const serviceSms = process.env.NODE_ENV === 'development' ? { status: true, message: `Código Enviado con Éxito al número: ******4090` } : await sendSms(employeeData[0].phone, code);

        if (process.env.NODE_ENV === 'development') {
          console.log(code);
        }

        if (serviceSms.status) {
          const codeEncrypt = encryptCrypt(code);

          res.status(200).json({
            message: serviceSms.message,
            data: payloadEncrypt,
            code: codeEncrypt,
          });
        } else {
          res.status(500).json({
            error: `La Autenticación por SMS falló: ${serviceSms.error}`,
          });
        }
      } else {
        res.status(401).json({
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

const verifyCode = async (req, res) => {
  const data = req.body;
  let codeDecrypt = decryptCrypt(data.codeResend);
  res.status(200).json({ status: codeDecrypt === data.code });
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
  const id = req.params.id;

  try {
    const deleteEmployeeServices = await employeesService.deleteEmployee(id);
    res.status(200).json({ message: deleteEmployeeServices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Sesión Finalizada" });
};

const recoverPassword = async (req, res) => {
  const data = req.body;

  const employeeData = await employeesService.getEmployeeEmail(data);
  if (!employeeData.length > 0) {
    res.status(200).json({ message: `Usurio no encontrado` });
  }
  const paylod = {
    id: employeeData[0].id,
    email: employeeData[0].email,
  };
  const options = {
    algorithm: "HS256",
    expiresIn: "1h",
  };
  const tokenRecover = jwt.sign(paylod, process.env.SECRET_NODE, options);

  const tokenloadEncrypt = encryptCrypt(tokenRecover);

  const url = `${process.env.URL_NODE}${encodeURIComponent(tokenloadEncrypt)}`;

  const info = await transporter.sendMail({
    from: '"Sistemas Point Sell"',
    to: paylod.email,
    subject: "Recuperación de contraseña 🪪",
    text: "",
    html: `Haz clic en el siguiente enlace para restablecer tu contraseña: <a href="${url}">Restablecer contraseña</a>`,
  });
  return res
    .status(200)
    .json({ data: "Correo de recuperación enviado a " + paylod.email });
};

const verificationToReset = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: "Token y Password son requeridos" });
  }
  try {
    let tokenDecrypt = decryptCrypt(token);
    jwt.verify(
      tokenDecrypt,
      process.env.SECRET_NODE,
      { algorithms: ["HS256"] },
      (err, decoded) => {
        if (!validateEmailAndId(decoded)) {
          return res
            .status(201)
            .json({ message: "Los datos del usuario no coinciden" });
        } else {
          if (!EditPs(decoded.id, password)) {
            return res
              .status(500)
              .json({
                message: "Ocurrio un error al editar la contraseña del usuario",
              });
          } else {
            return res
              .status(200)
              .json({ message: "Contraseña actualizada correctamente" });
          }
        }
      }
    );
  } catch (error) {
    return res.status(400).send("Token inválido o expirado");
  }
};

const validateEmailAndId = async (decode) => {
  const employeeData = await employeesService.getEmployeeEmail(decode.id);
  return decode.email === employeeData.email && decode.id === employeeData.id;
};

const EditPs = async (id, password) => {
  try {
    const hashedPassword = await passwordService.hashPassword(password);
    const objEmp = {
      password: hashedPassword,
      updated_at: createUpdatetAt(),
      id: id,
    };
    const updateEmployeesServices = await employeesService.putEmployeesPs(
      objEmp
    );
    return updateEmployeesServices;
  } catch (error) {
    return false;
  }
};

module.exports = {
  getAllEmployees,
  registerEmployees,
  login,
  getEmployee,
  filterEmployeesAll,
  putEmployees,
  deleteEmployee,
  logout,
  recoverPassword,
  verificationToReset,
  verifyCode,
};
