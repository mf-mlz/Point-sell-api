const { body, validationResult, check, param } = require('express-validator');

const validateID = [
    body('id')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .isNumeric(),
    param('id')
        .optional()
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

const validateProduct = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 200 })
        .isString()
        .matches(/^([a-zA-Z0-9ñáéíóú\s.,\"\'-_&%]+)$/),
    body('description')
        .trim()
        .isLength({ min: 1, max: 200 })
        .isString()
        .matches(/^([a-zA-Z0-9ñáéíóú\s.,\"\'-_&%]+)$/),
    body('code')
        .trim()
        .isLength({ min: 1, max: 50 })
        .matches(/([0-9])/),
    body('price')
        .trim()
        .isLength({ min: 1, max: 10 })
        .isNumeric(),
    body('category')
        .trim()
        .isLength({ min: 1, max: 100 })
        .isString()
        .matches(/^([a-zA-Z0-9ñáéíóú\s.,])/),
    body('stock')
        .trim()
        .isLength({ min: 1, max: 10 })
        .isNumeric(),
    body('key_sat')
        .trim()
        .isLength({ min: 1, max: 20 })
        .matches(/([0-9])/),
    body('expiration_date')
        .isISO8601()
        .withMessage('Formato de fecha incorrecto'/* 'La fecha debe estar en el formato YYYY-MM-DD' */)
        .toDate(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: "Ocurrió un error en la validación de los datos de entrada." });
        }
        next();
    }
];

const validateProductFilter = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .isString()
        .matches(/^([a-zA-Z0-9ñáéíóú\s.,\"\'-_&%]+)$/),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .isString()
        .matches(/^([a-zA-Z0-9ñáéíóú\s.,\"\'-_&%]+)$/),
    body('code')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .matches(/([0-9])/),
    body('price')
        .optional()
        .trim()
        .isLength({ min: 1, max: 10 })
        .isNumeric(),
    body('category')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .isString()
        .matches(/^([a-zA-Z0-9ñáéíóú\s.,])/),
    body('stock')
        .optional()
        .trim()
        .isLength({ min: 1, max: 10 })
        .isNumeric(),
    body('key_sat')
        .optional()
        .trim()
        .isLength({ min: 1, max: 20 })
        .matches(/([0-9])/),
    body('expiration_date')
        .optional()
        .isISO8601()
        .withMessage('Formato de fecha incorrecto'/* 'La fecha debe estar en el formato YYYY-MM-DD' */)
        .toDate(),
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
    validateProduct,
    validateProductFilter
};
