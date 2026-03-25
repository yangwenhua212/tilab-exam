import redis from 'redis';

let redisClient = null;

// 初始化Redis（可选）
if (process.env.REDIS_URL) {
  redisClient = redis.createClient({ url: process.env.REDIS_URL });
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  redisClient.connect().then(() => console.log('Redis connected')).catch(console.error);
}

export const getCache = async (key) => {
  if (!redisClient || !redisClient.isOpen) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Redis get error:', err);
    return null;
  }
};

export const setCache = async (key, value, expireSeconds = 300) => {
  if (!redisClient || !redisClient.isOpen) return;
  try {
    await redisClient.set(key, JSON.stringify(value), { EX: expireSeconds });
  } catch (err) {
    console.error('Redis set error:', err);
  }
};

export const delCache = async (key) => {
  if (!redisClient || !redisClient.isOpen) return;
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error('Redis del error:', err);
  }
};

export const clearQuestionsCache = async () => {
  if (!redisClient || !redisClient.isOpen) return;
  try {
    let cursor = 0;
    const pattern = 'questions:*';
    let deletedCount = 0;
    do {
      const reply = await redisClient.scan(cursor, {
        MATCH: pattern,
        COUNT: 100
      });
      cursor = reply.cursor;
      const keys = reply.keys;
      if (keys.length) {
        await redisClient.del(keys);
        deletedCount += keys.length;
      }
    } while (cursor !== 0);
    if (deletedCount > 0) {
      console.log(`Cleared ${deletedCount} question cache keys`);
    }
    await delCache('subjects');
    await delCache('question-types');
  } catch (err) {
    console.error('Clear cache error:', err);
  }
};