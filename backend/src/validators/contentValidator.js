import { body, param } from 'express-validator';

export const idRule = [param('id').isMongoId().withMessage('Invalid id.')];

const offerFields = (isUpdate) => {
  const field = (name) => (isUpdate ? body(name).optional() : body(name));
  return [
    field('title')
      .isString()
      .trim()
      .isLength({ min: 2, max: 80 })
      .withMessage('Title must be 2 to 80 characters.'),
    field('description')
      .isString()
      .trim()
      .isLength({ min: 10, max: 300 })
      .withMessage('Description must be 10 to 300 characters.'),
    body('discountText')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 30 })
      .withMessage('Label is too long.'),
    body('image').optional().isString().trim().isLength({ max: 300 }),
    field('validTill').isISO8601().withMessage('Choose a valid end date.').toDate(),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('Active must be true or false.')
      .toBoolean(),
  ];
};

const testimonialFields = (isUpdate) => {
  const field = (name) => (isUpdate ? body(name).optional() : body(name));
  return [
    field('name')
      .isString()
      .trim()
      .isLength({ min: 2, max: 60 })
      .withMessage('Name must be 2 to 60 characters.'),
    body('role')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 60 })
      .withMessage('Role is too long.'),
    field('message')
      .isString()
      .trim()
      .isLength({ min: 10, max: 400 })
      .withMessage('Message must be 10 to 400 characters.'),
    field('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1 to 5.').toInt(),
    body('avatar').optional().isString().trim().isLength({ max: 300 }),
    body('isVisible')
      .optional()
      .isBoolean()
      .withMessage('Visible must be true or false.')
      .toBoolean(),
  ];
};

export const createOfferRules = offerFields(false);
export const updateOfferRules = [...idRule, ...offerFields(true)];
export const createTestimonialRules = testimonialFields(false);
export const updateTestimonialRules = [...idRule, ...testimonialFields(true)];
export const markReadRules = [
  ...idRule,
  body('isRead').isBoolean().withMessage('isRead must be true or false.').toBoolean(),
];
