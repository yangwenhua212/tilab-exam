import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { adminMiddleware } from '../middlewares/admin.js';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);
router.post('/batch-import', adminController.batchImport);
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);

export default router;