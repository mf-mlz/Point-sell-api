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

const validateSaleProduct = [
    body('quantity')
        .trim()
        .isLength({ min: 1, max: 10 })
        .isNumeric(),
    body('total')
        .trim()
        .isLength({ min: 1, max: 10 })
        .isNumeric(),

    body('salesId')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .isNumeric(),
    body('salesId')
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

const validateSaleProductFilter = [
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

   
        body('quantity')
        .trim()
        .isLength({ min: 1, max: 10 })
        .isNumeric(),
    body('total')
        .trim()
        .isLength({ min: 1, max: 10 })
        .isNumeric(),

    body('salesId')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .isNumeric(),
    body('salesId')
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

module.exports = {
    validateID,
    validateSaleProduct,
    validateSaleProductFilter
};
