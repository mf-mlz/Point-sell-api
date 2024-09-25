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

const validateSale = [
    body('date')
        .isISO8601()
        .withMessage('Formato de fecha incorrecto'/* 'La fecha debe estar en el formato YYYY-MM-DD' */)
        .toDate(),
    body('totalAmount')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .isNumeric(),
    body('payment')
        .trim()
        .isLength({ min: 1, max: 50 })
        .isNumeric(),
    body('dataPayment')
        .trim()
        .isLength({ min: 1, max: 50 })
        .matches(/^[0-9]*$/),
    body('status')
        .trim()
        .isLength({ min: 1, max: 30 })
        .matches(/^[a-zA-ZÀ-ÿ0-9\s,.'#-]*$/),
    body('customerId')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .isNumeric(),
    body('employeesId')
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

const validateSaleFilter = [
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
    body('date')
        .optional()
        .isISO8601()
        .withMessage('Formato de fecha incorrecto'/* 'La fecha debe estar en el formato YYYY-MM-DD' */)
        .toDate(),
    body('totalAmount')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .isNumeric(),
    body('payment')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .isNumeric(),
    body('dataPayment')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .matches(/^[0-9]*$/),
    body('status')
        .optional()
        .trim()
        .isLength({ min: 1, max: 30 })
        .matches(/^[a-zA-ZÀ-ÿ0-9\s,.'#-]*$/),
    body('customerId')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .isNumeric(),
    body('employeesId')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .isNumeric(),
    body('dateBefore')
        .optional()
        .isISO8601()
        .withMessage('Formato de fecha incorrecto'/* 'La fecha debe estar en el formato YYYY-MM-DD' */)
        .toDate(),
    body('dateAfter')
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
    validateSale,
    validateSaleFilter
};
