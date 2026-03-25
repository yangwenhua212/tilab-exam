import { AppError } from '../utils/error.js';

export const adminMiddleware = (req, res, next) => {
  if (req.user.username !== 'admin') {
    return next(new AppError(403, '需要管理员权限'));
  }
  next();
};