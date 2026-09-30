import { body, param, query } from 'express-validator';
import { ORDER_STATUSES } from '../db/models/Order.js';

export const createOrderRules = [
  body('items').isArray({ min: 1, max: 30 }).withMessage('Your cart is empty.'),
  body('items.*.menuItem').isMongoId().withMessage('One of the items is not valid.'),
  body('items.*.quantity')
    .isInt({ min: 1, max: 20 })
    .withMessage('Quantity must be between 1 and 20.')
    .toInt(),
  body('orderType').isIn(['pickup', 'dine-in']).withMessage('Choose pickup or dine-in.'),
  body('paymentMethod').isIn(['cash', 'card', 'wallet']).withMessage('Choose a payment method.'),
  body('notes')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Notes are too long.'),
];

export const listOrdersRules = [
  query('date')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Invalid date.'),
  query('status').optional().isIn(ORDER_STATUSES).withMessage('Unknown status.'),
];

export const updateOrderStatusRules = [
  param('id').isMongoId().withMessage('Invalid id.'),
  body('status')
    .isIn(ORDER_STATUSES)
    .withMessage(`Status must be one of: ${ORDER_STATUSES.join(', ')}.`),
];
