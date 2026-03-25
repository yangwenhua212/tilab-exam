import * as errorRepository from '../repositories/errorRepository.js';
import { AppError } from '../utils/error.js';

export const addError = async (userId, questionId, subject, userAnswer) => {
  if (!questionId || !subject || !userAnswer) {
    throw new AppError(400, '缺少必要参数');
  }
  await errorRepository.addError(userId, questionId, subject, userAnswer);
};

export const getUserErrors = async (userId, subject, questionType) => {
  return await errorRepository.findErrorsByUser(userId, subject, questionType);
};

export const deleteError = async (errorId, userId) => {
  const deleted = await errorRepository.deleteError(errorId, userId);
  if (!deleted) {
    throw new AppError(404, '错题不存在或无权删除');
  }
};

export const getErrorQuestions = async (userId, subject, questionType) => {
  return await errorRepository.getErrorQuestionsByUser(userId, subject, questionType);
};