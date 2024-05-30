const { body, validationResult, check } = require('express-validator');

const validateID = [
    body('id')
        .trim()
        .isLength({ min: 1 }).withMessage('El campo id es requerido')
        .isNumeric().withMessage('El campo id debe contener solo caracteres numericos'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors });
        }
        next();
    }
];

const validateClient = [
    body('name')
        .trim()
        .isLength({ min: 1 }).withMessage('El campo name es requerido')
        .isString().withMessage('El campo name debe contener solo letras'),
    body('email')
        .trim()
        .isLength({ min: 1 }).withMessage('El campo email es requerido')
        .isEmail().withMessage('El campo email debe ser un correo electrónico válido'),
    body('phone')
        .trim()
        .isLength({ min: 1, max: 10 }).withMessage('El campo phone es requerido en su formato solicitado')
        .isNumeric().withMessage('El campo phone debe ser numérico'),
    body('address')
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('El campo address es requerido en su formato solicitado')
        .matches(/^[a-zA-ZÀ-ÿ0-9\s,.'#-]*$/).withMessage('El campo address debe contener solo letras, números y los caracteres especiales permitidos (,.\'-#)'),
    body('zip')
        .trim()
        .isLength({ min: 1, max: 8 }).withMessage('El campo zip es requerido en su formato solicitado')
        .isNumeric().withMessage('El campo zip debe contener solo números'),
    body('tax_system')
        .trim()
        .isLength({ min: 1 }).withMessage('El campo tax_system es requerido')
        .isNumeric().withMessage('El campo tax_system debe contener solo números'),
    body('tax_id')
        .trim()
        .isLength({ min: 1 }).withMessage('El campo tax_id es requerido')
        .matches(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/).withMessage('El campo tax_id debe ser un RFC válido'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors });
        }
        next();
    }
];

const validateClientFilter = [
    check().custom((value, { req }) => {
        if (typeof req.body !== 'object' || req.body === null) {
            throw new Error('El cuerpo de la solicitud debe ser un objeto');
        }
        return true;
    }),
    body('id')
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage('El campo id es requerido')
        .isNumeric().withMessage('El campo id debe contener solo caracteres numericos'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage('El campo name es requerido')
        .isString().withMessage('El campo name debe contener solo letras'),
    body('email')
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage('El campo email es requerido')
        .isEmail().withMessage('El campo email debe ser un correo electrónico válido'),
    body('phone')
        .optional()
        .trim()
        .isLength({ min: 1, max: 10 }).withMessage('El campo phone es requerido en su formato solicitado')
        .isNumeric().withMessage('El campo phone debe ser numérico'),
    body('address')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('El campo address es requerido en su formato solicitado')
        .matches(/^[a-zA-ZÀ-ÿ0-9\s,.'#-]*$/).withMessage('El campo address debe contener solo letras, números y los caracteres especiales permitidos (,.\'-#)'),
    body('zip')
        .optional()
        .trim()
        .isLength({ min: 1, max: 8 }).withMessage('El campo zip es requerido en su formato solicitado')
        .isNumeric().withMessage('El campo zip debe contener solo números'),
    body('tax_system')
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage('El campo tax_system es requerido')
        .isNumeric().withMessage('El campo tax_system debe contener solo números'),
    body('tax_id')
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage('El campo tax_id es requerido')
        .matches(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/).withMessage('El campo tax_id debe ser un RFC válido'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors });
        }
        next();
    }
];

module.exports = {
    validateID,
    validateClient,
    validateClientFilter
};
