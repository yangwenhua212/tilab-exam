import logger from '../utils/logger.js';
import { error } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  // 自定义业务错误
  if (err.isOperational) {
    return error(res, err.message, err.statusCode);
  }

  // 未知错误，不暴露细节
  error(res, '服务器内部错误', 500);
};