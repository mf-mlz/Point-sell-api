const { body, validationResult, check } = require('express-validator');

const validateID = [
    body('id')
        .trim()
        .isLength({ min: 1 })
        .isNumeric(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: "Ocurrió un error en la validación de los datos de entrada." });
        }
        next();
    }
];

const validateEmployee = [
    body('name')
        .trim()
        .isLength({ min: 1 })
        .isString()
        .matches(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/),
    body('email')
        .trim()
        .isLength({ min: 1 })
        .isEmail(),
    body('phone')
        .trim()
        .isLength({ min: 1, max: 10 })
        .isNumeric(),
    body('address')
        .trim()
        .isLength({ min: 1, max: 100 })
        .matches(/^[a-zA-ZÀ-ÿ0-9\s,.'#-]*$/),
    body('role_id')
        .trim()
        .isLength({ min: 1, max: 1 })
        .isNumeric(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: "Ocurrió un error en la validación de los datos de entrada." });
        }
        next();
    }
];

const validateEmployeeFilter = [
    check().custom((value, { req }) => {
        if (typeof req.body !== 'object' || req.body === null) {
            return res.status(400).json({ errors: "El cuerpo de la Solicitud tiene un formato incorrecto." });
        }
        return true;
    }),
    body('id')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .isNumeric(),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .isString()
        .matches(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/),
    body('email')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .isEmail(),
    body('phone')
        .optional()
        .trim()
        .isLength({ min: 1, max: 10 })
        .isNumeric(),
    body('address')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .matches(/^[a-zA-ZÀ-ÿ0-9\s,.'#-]*$/),
    body('role_id')
        .optional()
        .trim()
        .isLength({ min: 1, max: 1 })
        .isNumeric(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: "Ocurrió un error en la validación de los datos de entrada." });
        }
        next();
    }
];

module.exports = {
    validateID,
    validateEmployee,
    validateEmployeeFilter
};
