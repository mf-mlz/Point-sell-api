/* Key ECDSA (ES256) */
const fs = require("fs");
const path = require("path");
const pKey = fs.readFileSync(path.join(process.cwd(), process.env.KN), 'utf8');
const employeesService = require('../services/employeesService');
const passwordService = require("../services/passwordService");
const { verifyData, createUpdatetAt } = require('../../../utils/helpers');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

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
                    email: employeeData[0].email,
                    phone: employeeData[0].phone,
                    role_name: employeeData[0].role_name,
                };

                const options = {
                    algorithm: "ES256",
                    expiresIn: "7d",
                };

                const token = jwt.sign(payload, pKey, options);

                res.cookie("token", token, {
                    httpOnly: false,
                    secure: false, /* Production => true */
                    sameSite: 'Lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    sameSite: "Strict",
                });

                res
                    .status(200)
                    .json({ message: `Inicio de sesión exitoso` });
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
    const id = req.params.id;

    try {
        const deleteEmployeeServices = await employeesService.deleteEmployee(id);
        res.status(200).json({ message: deleteEmployeeServices });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const logout = async (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Sesión Finalizada' });
}

const recoverPassword = async (req, res) => {

    const data = req.body;

    const employeeData = await employeesService.getEmployee(data);
    if (!employeeData.length > 0) {
        res.status(200).json({ message: `Usurio no encontrado` });
    }
    const paylod = {
        email: employeeData[0].email
    }
    const options = {
        algorithm: 'HS256',
        expiresIn: '1h'
    };
    const tokenRecover = jwt.sign(paylod, process.env.SECRET_NODE, options);
    const url = `${process.env.URL_NODE}${tokenRecover}`;

    const info = await transporter.sendMail({
        from: '"Sistemas Point Sell"', // sender address
        to: paylod.email, // list of receivers
        subject: "Recuperación de contraseña 🪪", // Subject line
        text: "", // plain text body
        html: `Haz clic en el siguiente enlace para restablecer tu contraseña: <a href="${url}">Restablecer contraseña</a>`, // html body
    });
    console.log("Message sent: %s", info.messageId);
    return res.status(200).json({ data: 'Correo de recuperación enviado a ' + paylod.email });
};

const verificationToReset = async (req, res) => {

    const { token, password } = req.body;
    if (!token) {
        return res.status(400).send('Token es requerido');
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.SECRET_NODE);
    } catch (error) {
        return res.status(400).send('Token inválido o expirado');
    }

    let employeeData;
    try {
        const d = { email: decoded.email };
        employeeData = await employeesService.getEmployee(d);
        if (!employeeData.length) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        return res.status(400).send('Error al obtener Usuarios');
    }

    try {
        const hashedPassword = await passwordService.hashPassword(password);
        employeeData[0].password = hashedPassword;
    } catch (error) {
        return res.status(400).send('Hash no generado');
    }

    try {
        employeeData[0].updated_at = createUpdatetAt();
        const updateEmployeesServices = await employeesService.putEmployeesPs(employeeData[0]); // Asegúrate de pasar `employeeData`
        return res.status(200).json({ message: updateEmployeesServices });
    } catch (error) {
        return res.status(400).send('Contraseña no actualizada');
    }
};

module.exports = {
    getAllEmployees,
    registerEmployees,
    login,
    filterEmployees,
    filterEmployeesAll,
    putEmployees,
    deleteEmployee,
    logout,
    recoverPassword,
    verificationToReset
};