import * as questionRepository from '../repositories/questionRepository.js';
import * as userService from './userService.js';
import { clearQuestionsCache } from '../utils/cache.js';

export const batchImportQuestions = async (questions) => {
  let successCount = 0;
  let failCount = 0;
  for (const q of questions) {
    try {
      await questionRepository.createQuestion({
        year: q.year,
        questionIndex: q.question_index,
        subject: q.subject,
        question: q.question,
        options: q.options,
        answer: q.answer,
        analysis: q.analysis,
        difficulty: q.difficulty,
        type: q.type || '真题',
        questionType: q.question_type || '单选题',
      });
      successCount++;
    } catch (err) {
      failCount++;
    }
  }
  await clearQuestionsCache();
  return { successCount, failCount };
};

export const getAllUsers = async () => {
  return await userService.getAllUsers();
};

export const deleteUser = async (userId) => {
  await userService.deleteUser(userId);
};