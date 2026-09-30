import { body, param, query } from 'express-validator';
import { RESERVATION_STATUSES, SEAT_TYPES } from '../db/models/Reservation.js';

const dateRule = (field) =>
  field.matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Choose a valid date.');
const timeRule = (field) => field.matches(/^\d{2}:\d{2}$/).withMessage('Choose a valid time.');

export const availabilityRules = [
  dateRule(query('date')),
  query('seatType').isIn(SEAT_TYPES).withMessage('Choose a table or a study desk.'),
];

export const createReservationRules = [
  body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2 to 60 characters.'),
  body('email').trim().toLowerCase().isEmail().withMessage('Enter a valid email address.'),
  body('phone')
    .trim()
    .matches(/^[+\d\s()-]{7,20}$/)
    .withMessage('Enter a valid phone number.'),
  dateRule(body('date')),
  timeRule(body('time')),
  body('guests').isInt({ min: 1, max: 8 }).withMessage('Guests must be between 1 and 8.').toInt(),
  body('seatType').isIn(SEAT_TYPES).withMessage('Choose a table or a study desk.'),
  body('notes')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Notes are too long.'),
];

export const reservationIdRule = [param('id').isMongoId().withMessage('Invalid id.')];

export const listReservationsRules = [
  query('status').optional().isIn(RESERVATION_STATUSES).withMessage('Unknown status.'),
  query('date')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Invalid date.'),
];

export const updateReservationStatusRules = [
  ...reservationIdRule,
  body('status')
    .isIn(RESERVATION_STATUSES)
    .withMessage(`Status must be one of: ${RESERVATION_STATUSES.join(', ')}.`),
];

export const rescheduleRules = [
  ...reservationIdRule,
  dateRule(body('date')),
  timeRule(body('time')),
];
