import express from 'express';
import * as errorController from '../controllers/errorController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);
router.post('/', errorController.addError);
router.get('/', errorController.getErrors);
router.delete('/:id', errorController.deleteError);
router.get('/questions', errorController.getErrorQuestions); // 用于获取错题题目列表

export default router;