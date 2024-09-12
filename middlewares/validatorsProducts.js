const { body, validationResult, check } = require('express-validator');

const validateID = [
    body('id')
        .trim()
        .isLength({ min: 1 })
        .isNumeric(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors });
        }
        next();
    }
];

const validateProduct = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 20 })
        .isString()
        .matches(/^([a-zA-Zñáéíóú\s]{1,20})/),
    body('description')
        .trim()
        .isLength({ min: 1, max: 50 })
        .isString()
        .matches(/^([\W\wÑ&]{1,50})/),
    body('price')
        .trim()
        .isLength({ min: 1, max: 10 })
        .isNumeric(),
    body('category')
        .trim()
        .isLength({ min: 1, max: 50 })
        .isString()
        .matches(/^([\W\wÑ&]{1,50})/),
    body('stock')
        .trim()
        .isLength({ min: 1, max: 10 })
        .isNumeric(),
    body('key_sat')
        .trim()
        .isLength({ min: 1, max: 8 })
        .matches(/([0-9]{8})/),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: "Ocurrió un error en la validación de los datos de entrada." });
        }
        next();
    }
];

const validateProductFilter = [
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
        .isLength({ min: 1, max: 20 })
        .isString()
        .matches(/^([a-zA-Zñáéíóú\s]{1,20})/),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .isString()
        .matches(/^([\W\wÑ&]{1,50})/),
    body('price')
        .optional()
        .trim()
        .isLength({ min: 1, max: 10 })
        .isNumeric(),
    body('category')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .isString()
        .matches(/^([\W\wÑ&]{1,50})/),
    body('stock')
        .optional()
        .trim()
        .isLength({ min: 1, max: 10 })
        .isNumeric(),
    body('key_sat')
        .optional()
        .trim()
        .isLength({ min: 1, max: 8 })
        .matches(/([0-9]{8})/),
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
