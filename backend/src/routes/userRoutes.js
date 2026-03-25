import express from 'express';
import * as userController from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/profile', userController.getProfile);
router.post('/update', userController.updateProfile);

export default router;