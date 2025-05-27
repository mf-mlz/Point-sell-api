const employeesService = require("../services/employeesService");
const passwordService = require("../services/passwordService");
const { verifyData, createUpdatetAt } = require("../../../utils/helpers");
const modulesController = require("../../modules/controllers/modulesController");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { encryptCrypt, decryptCrypt } = require("../../../utils/crypto-js");
const nodemailer = require("nodemailer");
const { sendSms, generateCodeAuthSms } = require("../../../services/twilio");

/* Key ECDSA (ES256) */
const pKey = fs.readFileSync(path.join(process.cwd(), process.env.KN), "utf8");

const transporter = nodemailer.createTransport({
  host: process.env.SERVICE_NODE,
  port: process.env.PORT_NODE,
  secure: process.env.SECURITY_NODE,
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
    return res.status(200).json({ message: registerEmployeesServices });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getEmployee = async (req, res) => {
  const data = req.body;
  try {
    delete data.employeeId;
    const employeeData = await employeesService.getEmployee(data);
    if (employeeData.length > 0) {
      return res.status(200).json({
        message: `Se encontraron ${employeeData.length} registros`,
        employee: employeeData,
      });
    } else {
      return res.status(200).json({ message: `No se encontraron registros` });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Ocurrió un error al obtener los registros" });
  }
};

const filterEmployeesAll = async (req, res) => {
  const data = req.body;
  try {
    const employeeData = await employeesService.getEmployeeAll(data);
    if (employeeData.length > 0) {
      return res.status(200).json({
        message: `Se encontraron ${employeeData.length} registros`,
        employee: employeeData,
      });
    } else {
      return res.status(200).json({ message: `No se encontraron registros` });
    }
  } catch (err) {
    return res
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
        /* Get Modules */
        const modules = await modulesController.getModuleAccessByRoleReturn(
          encryptCrypt(JSON.stringify({ role_name: employeeData[0].role_name }))
        );
        const payload = {
          id: employeeData[0].id,
          name: employeeData[0].name,
          role_name: employeeData[0].role_name,
          photo_name: employeeData[0].photo,
          modules: decryptCrypt(modules),
        };

        const payloadEncrypt = encryptCrypt(JSON.stringify(payload));

        /* Code SMS */
        const code = await generateCodeAuthSms();

        /* Auth SMS => env development not Send SMS and console.log(code) */
        const serviceSms =
          process.env.NODE_ENV === "development"
            ? {
                status: true,
                message: `Código Enviado con Éxito al número: ******4090`,
              }
            : await sendSms(employeeData[0].phone, code);

        if (process.env.NODE_ENV === "development") {
          console.log(code);
        }

        if (serviceSms.status) {
          const codeEncrypt = encryptCrypt(code);
          const temp = password.includes("TEMP") ? true : false;

          res.status(200).json({
            message: serviceSms.message,
            data: payloadEncrypt,
            code: codeEncrypt,
            temp: temp,
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

/* Verify Code and Generate Token Cookie */
const verifyCode = async (req, res) => {
  const data = req.body;
  let codeDecrypt = decryptCrypt(data.codeResend);
  try {
    /* Code Success */
    if (codeDecrypt === data.code) {
      const options = {
        algorithm: "ES256",
        expiresIn: "7d",
      };

      const token = jwt.sign({ data: data.data }, pKey, options);

      res.cookie("token", token, {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "development"
            ? false
            : true /* Production => true */,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      const dataDecrypt = decryptCrypt(data.data);
      const temp = data.temp;

      delete dataDecrypt.id;
      res.status(200).json({
        message: "Inicio de Sesión Exitoso",
        temp: temp,
      });
    } else {
      /* Code Not Success */
      res.status(401).json({
        error: "El código ingresado es incorrecto, intentalo nuevamente.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error:
        error.error ||
        "Ocurrió un error al Verificar el Código de Autenticación",
    });
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
  if (employeeData.length == 0) {
    res.status(500).json({ message: `Usurio no encontrado` });
  }

  /* Check Send -- Add Send Log */
  const dataLog = {
    email: employeeData[0].email,
    type: process.env.TYPE_EMAILF,
  };

  const checkEmailSend = await employeesService.checkEmailSend(dataLog);
  console.log(checkEmailSend);

  if (checkEmailSend > 0) {
    const paylod = {
      id: employeeData[0].id,
      email: employeeData[0].email,
      idLog: checkEmailSend,
    };

    const options = {
      algorithm: "HS256",
      expiresIn: "1h",
    };
    const tokenRecover = jwt.sign(paylod, process.env.SECRET_NODE, options);
    const tokenloadEncrypt = encryptCrypt(tokenRecover);

    /* Update Token Log */
    const dataToken = {
      id: checkEmailSend,
      token: tokenloadEncrypt,
    };

    const updateToken = await employeesService.putUpdateEmailLogToken(
      dataToken
    );

    const url = `${process.env.URL_NODE}${encodeURIComponent(
      tokenloadEncrypt
    )}`;

    const info = await transporter.sendMail({
      from: '"Sistemas Point Sell"',
      to: paylod.email,
      subject: "Sys POS - Recuperación de contraseña",
      text: "",
      html: `<div style="flex:1; background-color:#1c1c27; padding:40px; color:white;text-align:center;width:500px; height:200px;;">
              <h1 style="font-size:28px; margin-bottom:20px;">Recuperación de contraseña 🪪</h1>
              <p style="font-size:16px; line-height:1.5; margin-bottom:30px;"> ¡Hola ${
                employeeData[0].name ? employeeData[0].name : "Colaborador"
              }! Da click en el botón para modificar la contraseña.</p>
              <a style="background-color:#dc3545; color:white; border:none; padding:12px 25px; border-radius:4px; cursor:pointer; font-size:16px;text-decoration: none;" href="${url}" target="_blank"> Modificar contraseña </a>
           </div>`,
    });

    if (info.accepted.length > 0 && info.rejected.length === 0) {
      return res
        .status(200)
        .json({ message: "Correo de recuperación enviado a " + paylod.email });
    } else {
      return res
        .status(401)
        .json({ error: "Ocurrió un error al envíar el correo" });
    }
  } else {
    return res.status(429).json({
      message:
        "Ya se ha enviado un correo de recuperación hoy. Intenta mañana.",
    });
  }
};

/* Verification to Reset */
const verificationToReset = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: "Token y Password son requeridos" });
  }

  try {
    const tokenDecrypt = decryptCrypt(token);
    let decoded = jwt.verify(tokenDecrypt, process.env.SECRET_NODE, {
      algorithms: ["HS256"],
    });

    const status = await statusToken(decoded);

    if (status !== "Active") {
      return res.status(409).json({
        message:
          "Token inválido o expirado. Por favor solicita un nuevo enlace para restablecer la contraseña.",
      });
    }

    const validUser = await validateEmailAndId(decoded);
    if (!validUser) {
      return res
        .status(404)
        .json({ message: "Los datos del usuario no coinciden" });
    }

    const edited = await EditPs(decoded.id, password, decoded.idLog);
    if (!edited) {
      return res.status(500).json({
        message: "Ocurrio un error al editar la contraseña del usuario",
      });
    }

    return res
      .status(200)
      .json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    return res.status(400).json({ message: "Token inválido o expirado" });
  }
};

const statusToken = async (decode) => {
  const statusToken = await employeesService.getEmailLogStatusById(
    decode.idLog
  );

  return statusToken[0].status;
};

const validateEmailAndId = async (decode) => {
  const employeeData = await employeesService.getEmployeeEmail(decode);
  return (
    decode.email === employeeData[0].email && decode.id === employeeData[0].id
  );
};

const EditPs = async (id, password, idLog) => {
  try {
    const hashedPassword = await passwordService.hashPassword(password);
    const objEmp = {
      password: hashedPassword,
      updated_at: createUpdatetAt(),
      id: id,
    };
    const updateEmployeesServices = await employeesService.putEmployeesPs(
      objEmp,
      idLog
    );
    return updateEmployeesServices;
  } catch (error) {
    return false;
  }
};

/* Return Data Encrypt */
const returnDataSession = async (req, res) => {
  try {
    let userSessionEncrypt = req.headers["session-employee"];

    if (!userSessionEncrypt) {
      return res
        .status(401)
        .json({ error: "La petición no tiene cabecera de autenticación" });
    }
    userSessionEncrypt = userSessionEncrypt
      ? userSessionEncrypt.replace(/['"]+/g, "")
      : null;

    const data = decryptCrypt(userSessionEncrypt);
    delete data.modules;
    delete data.id;
    return res.status(200).json({ data: data });
  } catch (err) {
    return res.status(401).json({
      error: err.message || "Ocurrió un error al obtener los datos de sesión",
    });
  }
};

const returnModuleSession = async (req, res) => {
  try {
    let userSessionEncrypt = req.headers["session-employee"];

    if (!userSessionEncrypt) {
      res
        .status(401)
        .json({ error: "La petición no tiene cabecera de autenticación" });
    }
    userSessionEncrypt = userSessionEncrypt
      ? userSessionEncrypt.replace(/['"]+/g, "")
      : null;

    const data = decryptCrypt(userSessionEncrypt);

    res.status(200).json({ data: data.modules });
  } catch (err) {
    res.status(401).json({
      error: err.message || "Ocurrió un error al obtener los datos de sesión",
    });
  }
};

const uploadPhoto = async (req, res) => {
  const requiredFields = ["id", "photo"];

  const data = {
    id: req.body.id,
    photo: req.file.originalname,
  };

  const missingField = verifyData(requiredFields, data);
  if (missingField) {
    return res
      .status(400)
      .json({ error: `El campo ${missingField} es requerido` });
  }

  const { id, photo } = data;

  try {
    data.updated_at = createUpdatetAt();
    const putPhotoEmployees = await employeesService.putEmployeePhoto(data);
    return res.status(200).json({ message: putPhotoEmployees });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const verificationTokenReset = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res
      .status(400)
      .json({ message: "El Token es requerido", status: false });
  }

  try {
    const tokenDecrypt = decryptCrypt(token);
    let decoded = jwt.verify(tokenDecrypt, process.env.SECRET_NODE, {
      algorithms: ["HS256"],
    });

    const status = await statusToken(decoded);

    if (status !== "Active") {
      return res.status(409).json({
        message:
          "Token inválido o expirado. Por favor solicita un nuevo enlace para restablecer la contraseña.",
        status: false,
      });
    }

    return res.status(200).json({ message: "Token Válido", status: true });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Token inválido o expirado", status: false });
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
  returnDataSession,
  returnModuleSession,
  uploadPhoto,
  verificationTokenReset,
};
