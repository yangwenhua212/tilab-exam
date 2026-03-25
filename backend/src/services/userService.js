import * as userRepository from '../repositories/userRepository.js';
import { AppError } from '../utils/error.js';

export const getUserInfo = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError(404, '用户不存在');
  }
  return user;
};

export const updateUser = async (userId, data) => {
  const { username, bio, location, avatar } = data;
  // 简单校验：如果修改用户名，检查是否唯一
  if (username) {
    const existing = await userRepository.findByUsername(username);
    if (existing && existing.id !== userId) {
      throw new AppError(400, '用户名已被占用');
    }
  }
  await userRepository.updateUser(userId, { bio, location, avatar });
};

export const getAllUsers = async () => {
  return await userRepository.getAllUsers();
};

export const deleteUser = async (userId) => {
  await userRepository.deleteUser(userId);
};