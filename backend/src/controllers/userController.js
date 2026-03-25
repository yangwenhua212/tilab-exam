import * as userService from '../services/userService.js';
import { success, error } from '../utils/response.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserInfo(req.user.id);
    success(res, user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    await userService.updateUser(req.user.id, req.body);
    success(res, null, '更新成功');
  } catch (err) {
    next(err);
  }
};