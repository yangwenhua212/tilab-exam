import * as questionRepository from '../repositories/questionRepository.js';
import { clearQuestionsCache } from '../utils/cache.js';
import { AppError } from '../utils/error.js';

export const getQuestions = async (filters) => {
  return await questionRepository.findAll(filters);
};

export const addQuestion = async (questionData) => {
  const { type, year, questionIndex } = questionData;

  if (type === '真题') {
    if (!questionIndex || questionIndex <= 0) {
      throw new AppError(400, '真题必须填写题号且为正整数');
    }
    const exists = await questionRepository.checkUniqueIndex(year, questionIndex);
    if (exists) {
      throw new AppError(400, `该年份第${questionIndex}题已存在，请使用不同序号`);
    }
  }

  const id = await questionRepository.createQuestion(questionData);
  await clearQuestionsCache();
  return { id };
};

export const deleteQuestion = async (id) => {
  await questionRepository.deleteQuestion(id);
  await clearQuestionsCache();
};

export const batchDeleteQuestions = async (ids) => {
  const deletedCount = await questionRepository.batchDeleteQuestions(ids);
  await clearQuestionsCache();
  return deletedCount;
};

export const getSubjects = async () => {
  return await questionRepository.getDistinctSubjects();
};

export const getQuestionTypes = async () => {
  const dbTypes = await questionRepository.getDistinctQuestionTypes();
  const defaultTypes = ['单选题', '多选题', '判断题', '填空题', '简答题'];
  return [...new Set([...defaultTypes, ...dbTypes])];
};