import * as errorService from '../services/errorService.js';
import { success, error } from '../utils/response.js';

export const addError = async (req, res, next) => {
  try {
    const { questionId, subject, userAnswer } = req.body;
    await errorService.addError(req.user.id, questionId, subject, userAnswer);
    success(res, null, '错题已记录');
  } catch (err) {
    next(err);
  }
};

export const getErrors = async (req, res, next) => {
  try {
    const { subject, questionType } = req.query;
    const errors = await errorService.getUserErrors(req.user.id, subject, questionType);
    success(res, errors);
  } catch (err) {
    next(err);
  }
};

export const deleteError = async (req, res, next) => {
  try {
    await errorService.deleteError(req.params.id, req.user.id);
    success(res, null, '移除成功');
  } catch (err) {
    next(err);
  }
};

export const getErrorQuestions = async (req, res, next) => {
  try {
    const { userId, subject, questionType } = req.query;
    if (!userId) {
      return error(res, '缺少 userId', 400);
    }
    const questions = await errorService.getErrorQuestions(userId, subject, questionType);
    success(res, questions);
  } catch (err) {
    next(err);
  }
};