import { body } from 'express-validator';

export const chatRules = [
  body('sessionId')
    .isString()
    .matches(/^[A-Za-z0-9_-]{8,64}$/)
    .withMessage('Invalid chat session.'),
  body('message')
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Messages must be 1 to 500 characters.'),
];
