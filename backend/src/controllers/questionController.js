import * as questionService from '../services/questionService.js';
import { success, error } from '../utils/response.js';

export const getQuestions = async (req, res, next) => {
  try {
    const { subject, year, type, questionType } = req.query;
    const questions = await questionService.getQuestions({ subject, year, type, questionType });
    success(res, questions);
  } catch (err) {
    next(err);
  }
};

export const addQuestion = async (req, res, next) => {
  try {
    const result = await questionService.addQuestion(req.body);
    success(res, result, '添加成功');
  } catch (err) {
    next(err);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    await questionService.deleteQuestion(req.params.id);
    success(res, null, '删除成功');
  } catch (err) {
    next(err);
  }
};

export const batchDeleteQuestions = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const deletedCount = await questionService.batchDeleteQuestions(ids);
    success(res, { deletedCount }, `成功删除 ${deletedCount} 道题目`);
  } catch (err) {
    next(err);
  }
};

export const getSubjects = async (req, res, next) => {
  try {
    const subjects = await questionService.getSubjects();
    success(res, subjects);
  } catch (err) {
    next(err);
  }
};

export const getQuestionTypes = async (req, res, next) => {
  try {
    const types = await questionService.getQuestionTypes();
    success(res, types);
  } catch (err) {
    next(err);
  }
};