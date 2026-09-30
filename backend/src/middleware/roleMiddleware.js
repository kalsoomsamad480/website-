import ApiError from '../utils/ApiError.js';

/** Use after `protect`: allows only the listed roles. */
const authorize =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return next(ApiError.forbidden());
    return next();
  };

export default authorize;
