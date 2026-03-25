import 'dotenv/config';
import app from './src/app.js';
import { initDB } from './src/database/connection.js';
import logger from './src/utils/logger.js';

const PORT = 3001; // 临时固定

// 初始化数据库连接
await initDB();

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});