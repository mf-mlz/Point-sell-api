const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { deleteFile } = require('../utils/files');

const verifyToken = (req, res, next) => {

    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        if (req.file) {
            deleteFile(req.file)
                .then(() => {
                    return res.status(401).json({ message: 'La Petición no tiene Cabecera de Autorización y se eliminó correctamente el archivo' });
                })
                .catch(error => {
                    return res.status(500).json({ message: 'La Petición no tiene Cabecera de Autorización y ocurrió un error al eliminar el archivo' });
                });
        } else {
            return res.status(401).json({ message: 'La Petición no tiene Cabecera de Autorización' });
        }
    } else {
        try {
            
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    if (req.file) {
                        deleteFile(req.file)
                            .then(() => {
                                return res.status(500).json({ message: 'Falló la Autenticación y se eliminó correctamente el archivo' });
                            })
                            .catch(error => {
                                return res.status(500).json({ message: 'Falló la Autenticación y ocurrió un error al eliminar el archivo' });
                            });
                    } else {
                        return res.status(500).json({ message: 'Falló la Autenticación' });
                    }
                } else {
                    const idPayload = decoded.id;
                    const idEmployee = req.body.employeeId || req.query.employeeId || req.params.employeeId;

                    if (parseInt(idPayload) !== parseInt(idEmployee)) {
                        if (req.file) {
                            deleteFile(req.file)
                                .then(() => {
                                    return res.status(401).json({ message: 'Acceso Denegado: El ID del Empleado no corresponde con el ID de la Sesión y se eliminó correctamente el archivo' });
                                })
                                .catch(error => {
                                    return res.status(500).json({ message: 'Falló la Autenticación y ocurrió un error al eliminar el archivo' });
                                });
                        } else {
                            return res.status(401).json({ message: 'Acceso Denegado: El ID del Empleado no corresponde con el ID de la Sesión' });
                        }
                    } else {
                        next();
                    }
                }
            });

        } catch (err) {
            res.status(400).json({ message: 'Acceso Inválido' });
        }
    }

};


module.exports = {
    verifyToken
};