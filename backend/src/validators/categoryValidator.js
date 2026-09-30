import { body, param } from 'express-validator';

const categoryFieldRules = (isUpdate) => {
  const field = (name) => (isUpdate ? body(name).optional() : body(name));
  return [
    field('name')
      .trim()
      .isLength({ min: 2, max: 40 })
      .withMessage('Name must be 2 to 40 characters.'),
    body('description').optional().isString().trim().isLength({ max: 200 }),
    body('image').optional().isString().trim().isLength({ max: 300 }),
    body('order').optional().isInt({ min: 0, max: 100 }).toInt(),
  ];
};

export const categoryIdRule = [param('id').isMongoId().withMessage('Invalid id.')];
export const createCategoryRules = categoryFieldRules(false);
export const updateCategoryRules = [...categoryIdRule, ...categoryFieldRules(true)];
