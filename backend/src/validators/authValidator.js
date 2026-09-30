import { body } from 'express-validator';

const nameRule = () =>
  body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2 to 60 characters.');

const phoneRule = () =>
  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .matches(/^[+\d\s()-]{7,20}$/)
    .withMessage('Enter a valid phone number.');

const emailRule = () =>
  body('email').trim().toLowerCase().isEmail().withMessage('Enter a valid email address.');

export const registerRules = [
  nameRule(),
  emailRule(),
  body('password')
    .isString()
    .isLength({ min: 8, max: 72 })
    .withMessage('Password must be 8 to 72 characters.')
    .matches(/[A-Za-z]/)
    .withMessage('Password must include a letter.')
    .matches(/\d/)
    .withMessage('Password must include a number.'),
  phoneRule(),
];

export const loginRules = [
  emailRule(),
  body('password').isString().notEmpty().withMessage('Enter your password.'),
];

export const updateProfileRules = [nameRule().optional(), phoneRule()];
