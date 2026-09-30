import { body } from 'express-validator';

export const contactRules = [
  body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2 to 60 characters.'),
  body('email').trim().toLowerCase().isEmail().withMessage('Enter a valid email address.'),
  body('subject')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 120 })
    .withMessage('Subject is too long.'),
  body('message')
    .isString()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be 10 to 2000 characters.'),
];
