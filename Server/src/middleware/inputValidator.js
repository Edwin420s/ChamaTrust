const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  handleValidationErrors
];

const validateContribution = [
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a positive number'),
  body('senderSecret')
    .isLength({ min: 56, max: 56 })
    .withMessage('Invalid Stellar secret key'),
  body('receiverPublic')
    .isLength({ min: 56, max: 56 })
    .withMessage('Invalid Stellar public key'),
  handleValidationErrors
];

const validateLoanApplication = [
  body('amount')
    .isFloat({ gt: 0, max: 100000 })
    .withMessage('Amount must be between 0 and 100,000'),
  handleValidationErrors
];

const validateDispute = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters'),
  handleValidationErrors
];

module.exports = {
  validateLogin,
  validateContribution,
  validateLoanApplication,
  validateDispute,
  handleValidationErrors
};
