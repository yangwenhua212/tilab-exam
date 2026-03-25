import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/userRepository.js';
import { AppError } from '../utils/error.js';

export const register = async (userData) => {
  const { username, password, phone, qq } = userData;

  const existing = await userRepository.findByUsername(username);
  if (existing) {
    throw new AppError(400, '用户名已被注册');
  }

  const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || 10));
  const registerTime = new Date().toLocaleString();

  const userId = await userRepository.createUser({
    username,
    password: hashedPassword,
    phone: phone || null,
    qq: qq || null,
    registerTime,
  });

  return { id: userId };
};

export const login = async (username, password) => {
  const user = await userRepository.findByUsername(username);
  if (!user) {
    throw new AppError(401, '用户名或密码错误');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new AppError(401, '用户名或密码错误');
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...userInfo } = user;
  return { token, userInfo };
};