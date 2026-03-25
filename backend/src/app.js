import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/requestLogger.js';
import routes from './routes/index.js';
import logger from './utils/logger.js';

const app = express();

// 安全中间件
app.use(helmet());

// 日志中间件
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(requestLogger);

// 解析请求体
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS
app.use(cors());

// 静态文件
app.use('/uploads', express.static('uploads'));

// 路由
app.use('/api', routes);

// 404 处理
app.use((req, res) => {
  res.status(404).json({ code: 404, message: 'Not Found' });
});

// 全局错误处理（最后）
app.use(errorHandler);

export default app;