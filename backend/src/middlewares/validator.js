const { body, param, query, validationResult } = require('express-validator');

// Middleware para verificar resultados de validación
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

// Validaciones para Categorías
const categoryValidator = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres')
      .matches(/^[a-zA-Z0-9\s]+$/).withMessage('El nombre solo puede contener letras, números y espacios'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder los 500 caracteres'),
    body('status')
      .optional()
      .isBoolean().withMessage('El estado debe ser verdadero o falso'),
    validateResults
  ],

  update: [
    param('id')
      .isInt().withMessage('ID de categoría inválido'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres')
      .matches(/^[a-zA-Z0-9\s]+$/).withMessage('El nombre solo puede contener letras, números y espacios'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder los 500 caracteres'),
    body('status')
      .optional()
      .isBoolean().withMessage('El estado debe ser verdadero o falso'),
    validateResults
  ],

  getById: [
    param('id')
      .isInt().withMessage('ID de categoría inválido'),
    validateResults
  ]
};

// Validaciones para Productos
const productValidator = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder los 500 caracteres'),
    body('price')
      .notEmpty().withMessage('El precio es requerido')
      .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo')
      .custom((value) => {
        if (value > 999999.99) {
          throw new Error('El precio no puede ser mayor a 999,999.99');
        }
        return true;
      }),
    body('stock')
      .notEmpty().withMessage('El stock es requerido')
      .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo')
      .custom((value) => {
        if (value > 999999) {
          throw new Error('El stock no puede ser mayor a 999,999');
        }
        return true;
      }),
    body('categoryId')
      .notEmpty().withMessage('La categoría es requerida')
      .isInt().withMessage('ID de categoría inválido'),
    body('status')
      .optional()
      .isBoolean().withMessage('El estado debe ser verdadero o falso'),
    validateResults
  ],

  update: [
    param('id')
      .isInt().withMessage('ID de producto inválido'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder los 500 caracteres'),
    body('price')
      .optional()
      .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo')
      .custom((value) => {
        if (value > 999999.99) {
          throw new Error('El precio no puede ser mayor a 999,999.99');
        }
        return true;
      }),
    body('stock')
      .optional()
      .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo')
      .custom((value) => {
        if (value > 999999) {
          throw new Error('El stock no puede ser mayor a 999,999');
        }
        return true;
      }),
    body('categoryId')
      .optional()
      .isInt().withMessage('ID de categoría inválido'),
    body('status')
      .optional()
      .isBoolean().withMessage('El estado debe ser verdadero o falso'),
    validateResults
  ],

  updateStock: [
    param('id')
      .isInt().withMessage('ID de producto inválido'),
    body('stock')
      .notEmpty().withMessage('El stock es requerido')
      .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo')
      .custom((value) => {
        if (value > 999999) {
          throw new Error('El stock no puede ser mayor a 999,999');
        }
        return true;
      }),
    validateResults
  ],

  getById: [
    param('id')
      .isInt().withMessage('ID de producto inválido'),
    validateResults
  ]
};

// Validaciones para Clientes
const clientValidator = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres')
      .matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('El nombre solo puede contener letras y espacios'),
    body('email')
      .trim()
      .notEmpty().withMessage('El email es requerido')
      .isEmail().withMessage('Email inválido')
      .normalizeEmail(),
    body('phone')
      .optional()
      .trim()
      .matches(/^\+?[\d\s-]{8,20}$/).withMessage('Formato de teléfono inválido'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('La dirección no puede exceder los 200 caracteres'),
    body('status')
      .optional()
      .isBoolean().withMessage('El estado debe ser verdadero o falso'),
    validateResults
  ],

  update: [
    param('id')
      .isInt().withMessage('ID de cliente inválido'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres')
      .matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('El nombre solo puede contener letras y espacios'),
    body('email')
      .optional()
      .trim()
      .isEmail().withMessage('Email inválido')
      .normalizeEmail(),
    body('phone')
      .optional()
      .trim()
      .matches(/^\+?[\d\s-]{8,20}$/).withMessage('Formato de teléfono inválido'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('La dirección no puede exceder los 200 caracteres'),
    body('status')
      .optional()
      .isBoolean().withMessage('El estado debe ser verdadero o falso'),
    validateResults
  ],

  getById: [
    param('id')
      .isInt().withMessage('ID de cliente inválido'),
    validateResults
  ]
};

// Validaciones para Ventas
const saleValidator = {
  create: [
    body('clientId')
      .notEmpty().withMessage('El cliente es requerido')
      .isInt().withMessage('ID de cliente inválido'),
    body('items')
      .isArray({ min: 1 }).withMessage('Debe incluir al menos un producto')
      .custom((value) => {
        if (value.length > 50) {
          throw new Error('No puede exceder los 50 items por venta');
        }
        return true;
      }),
    body('items.*.productId')
      .isInt().withMessage('ID de producto inválido'),
    body('items.*.quantity')
      .isInt({ min: 1 }).withMessage('La cantidad debe ser mayor a 0')
      .custom((value) => {
        if (value > 999) {
          throw new Error('La cantidad por producto no puede exceder 999');
        }
        return true;
      }),
    body('observation')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('La observación no puede exceder los 500 caracteres'),
    validateResults
  ],

  update: [
    param('id')
      .isInt().withMessage('ID de venta inválido'),
    body('observation')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('La observación no puede exceder los 500 caracteres'),
    validateResults
  ],

  updateStatus: [
    param('id')
      .isInt().withMessage('ID de venta inválido'),
    body('status')
      .notEmpty().withMessage('El estado es requerido')
      .isIn(['PENDING', 'COMPLETED', 'CANCELLED']).withMessage('Estado inválido'),
    validateResults
  ],

  getById: [
    param('id')
      .isInt().withMessage('ID de venta inválido'),
    validateResults
  ],

  getByDateRange: [
    query('startDate')
      .optional()
      .isDate().withMessage('Fecha inicial inválida'),
    query('endDate')
      .optional()
      .isDate().withMessage('Fecha final inválida')
      .custom((endDate, { req }) => {
        if (req.query.startDate && endDate) {
          const start = new Date(req.query.startDate);
          const end = new Date(endDate);
          if (end < start) {
            throw new Error('La fecha final no puede ser menor a la fecha inicial');
          }
        }
        return true;
      }),
    validateResults
  ]
};

module.exports = {
  categoryValidator,
  productValidator,
  clientValidator,
  saleValidator
};