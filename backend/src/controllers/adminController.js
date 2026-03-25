import * as adminService from '../services/adminService.js';
import { success, error } from '../utils/response.js';

export const batchImport = async (req, res, next) => {
  try {
    const result = await adminService.batchImportQuestions(req.body);
    success(res, result, `导入完成：成功 ${result.successCount} 题，失败 ${result.failCount} 题`);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    success(res, users);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await adminService.deleteUser(req.params.id);
    success(res, null, '用户删除成功');
  } catch (err) {
    next(err);
  }
};