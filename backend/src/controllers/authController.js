import * as authService from '../services/authService.js';
import { success, error } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    success(res, result, '注册成功');
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    success(res, result, '登录成功');
  } catch (err) {
    next(err);
  }
};