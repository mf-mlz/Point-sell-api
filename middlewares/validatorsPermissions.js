const { body, param, validationResult, check } = require('express-validator');

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

const validatePermissions = [
    body('role_id')
        .trim()
        .isLength({ min: 1 })
        .isNumeric(),
    body('module')
        .trim()
        .isLength({ min: 1 })
        .isString(),
    body('permissions')
        .trim()
        .isLength({ min: 1 })
        .isString(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: "Ocurrió un error en la validación de los datos de entrada." });
        }
        next();
    }
];

const validatePermissionsFilter = [
  body('role_id')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .isNumeric(),
  body('module')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .isString(),
  body('permissions')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .isString(),
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
    validatePermissions,
    validatePermissionsFilter
};
