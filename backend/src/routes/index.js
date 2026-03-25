import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import questionRoutes from './questionRoutes.js';
import errorRoutes from './errorRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/questions', questionRoutes);
router.use('/errors', errorRoutes);
router.use('/admin', adminRoutes);

export default router;