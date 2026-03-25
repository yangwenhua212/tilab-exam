import express from 'express';
import * as questionController from '../controllers/questionController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { adminMiddleware } from '../middlewares/admin.js';

const router = express.Router();

// 公开路由
router.get('/', questionController.getQuestions);
router.get('/subjects', questionController.getSubjects);
router.get('/question-types', questionController.getQuestionTypes);

// 需要管理员权限
router.post('/', authMiddleware, adminMiddleware, questionController.addQuestion);
router.delete('/:id', authMiddleware, adminMiddleware, questionController.deleteQuestion);
router.delete('/batch', authMiddleware, adminMiddleware, questionController.batchDeleteQuestions);

export default router;