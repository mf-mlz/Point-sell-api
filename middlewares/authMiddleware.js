const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'La Petición no tiene Cabecera de Autorización' });
    }

    try {

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            
            if (err) {
                return res.status(500).json({ message: 'Falló la Autenticación' });
            }

            const idPayload = decoded.id;
            const idEmployee = req.body.employeeId || req.query.employeeId || req.params.employeeId;
            
            if (parseInt(idPayload) !== parseInt(idEmployee)) {
                return res.status(401).json({ message: 'Acceso Denegado: El ID del Empleado no corresponde con el ID de la Sesión' });
            }
            next();
        });

    } catch (err) {
        res.status(400).json({ message: 'Acceso Inválido' });
    }
};

module.exports = {
    verifyToken
};