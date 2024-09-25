const { body, validationResult, check } = require('express-validator');

const validateID = [
    body('id_sale')
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

const validateIdDownload = [
    body('id_invoice')
        .trim()
        .isLength({ min: 1 })
        .matches(/^[a-z0-9]+$/),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: "Ocurrió un error en la validación de los datos de entrada." });
        }
        next();
    }
];

const validateInvoice = [
    body('customer')
        .trim()
        .isLength({ min: 1 })
        .isNumeric(),
    body('id_sale')
        .trim()
        .isLength({ min: 1 })
        .isNumeric(),
    body('id_employee')
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

const validateInvoiceFilter = [
    body('customer')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .isNumeric(),
    body('id_sale')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .isNumeric(),
    body('id_employee')
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

const validateDataCancel = [
    check().custom((value, { req }) => {
        if (typeof req.body !== 'object' || req.body === null) {
            return res.status(400).json({ errors: "El cuerpo de la Solicitud tiene un formato incorrecto." });
        }
        return true;
    }),
    body('id_employee')
        .trim()
        .isLength({ min: 1 })
        .isNumeric(),
    body('id_invoice')
        .trim()
        .isLength({ min: 1})
        .isString()
        .matches(/^[a-z0-9]+$/),
    body('motive')
        .trim()
        .isLength({ min: 1, max: 2})
        .isString()
        .matches(/^[0-4]+$/),
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
    validateInvoice,
    validateInvoiceFilter,
    validateIdDownload,
    validateDataCancel
};
