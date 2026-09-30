import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/** Runs express-validator rules and returns 422 with field errors if any fail. */
const validate = (rules) => [
  ...rules,
  (req, _res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) return next();

    const errors = result
      .array({ onlyFirstError: true })
      .map((error) => ({ field: error.path, message: error.msg }));
    return next(ApiError.unprocessable('Please check the highlighted fields.', errors));
  },
];

export default validate;
