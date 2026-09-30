import { body, param, query } from 'express-validator';
import { MENU_TAGS } from '../db/models/MenuItem.js';

export const MENU_SORTS = ['default', 'price-asc', 'price-desc', 'name', 'newest'];

export const idParamRule = [param('id').isMongoId().withMessage('Invalid id.')];

export const listMenuRules = [
  query('category').optional().isSlug().withMessage('Invalid category.'),
  query('search').optional().isString().isLength({ max: 60 }).withMessage('Search is too long.'),
  query('tag')
    .optional()
    .custom((value) =>
      String(value)
        .split(',')
        .every((tag) => MENU_TAGS.includes(tag.trim())),
    )
    .withMessage(`Tag must be one of: ${MENU_TAGS.join(', ')}.`),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minPrice must be a positive number.'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('maxPrice must be a positive number.'),
  query('sort')
    .optional()
    .isIn(MENU_SORTS)
    .withMessage(`Sort must be one of: ${MENU_SORTS.join(', ')}.`),
  query('available')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('available must be true or false.'),
];

const menuFieldRules = (isUpdate) => {
  const field = (name) => (isUpdate ? body(name).optional() : body(name));
  return [
    field('name')
      .trim()
      .isLength({ min: 2, max: 80 })
      .withMessage('Name must be 2 to 80 characters.'),
    field('description')
      .trim()
      .isLength({ min: 10, max: 300 })
      .withMessage('Description must be 10 to 300 characters.'),
    field('price')
      .isFloat({ min: 0, max: 1000 })
      .withMessage('Price must be between 0 and 1000.')
      .toFloat(),
    field('category').isMongoId().withMessage('Choose a valid category.'),
    body('tags').optional().isArray().withMessage('Tags must be a list.'),
    body('tags.*')
      .isIn(MENU_TAGS)
      .withMessage(`Tags must be from: ${MENU_TAGS.join(', ')}.`),
    body('ingredients').optional().isArray({ max: 12 }).withMessage('Ingredients must be a list.'),
    body('ingredients.*').isString().trim().isLength({ min: 1, max: 40 }),
    body('image').optional().isString().trim().isLength({ max: 300 }),
    body('isAvailable')
      .optional()
      .isBoolean()
      .withMessage('isAvailable must be true or false.')
      .toBoolean(),
    body('calories').optional().isInt({ min: 0, max: 3000 }).toInt(),
  ];
};

export const createMenuRules = menuFieldRules(false);
export const updateMenuRules = [...idParamRule, ...menuFieldRules(true)];

export const availabilityRules = [
  ...idParamRule,
  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be true or false.')
    .toBoolean(),
];
