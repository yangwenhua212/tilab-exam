import bcrypt from 'bcryptjs';

export const createTables = async (pool) => {
  // 题目表
  await pool.execute(`CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    year INT,
    question_index INT NULL,
    subject VARCHAR(255),
    question TEXT,
    options TEXT,
    answer VARCHAR(255),
    analysis TEXT,
    difficulty VARCHAR(50),
    type VARCHAR(50) DEFAULT '真题',
    question_type VARCHAR(50) DEFAULT '单选题'
  )`);

  // 管理员表（简单密码，仅用于演示）
  await pool.execute(`CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255)
  )`);
  await pool.execute(`INSERT IGNORE INTO admins (username, password) VALUES (?, ?)`, ['admin', '123456']);

  // 用户表
  await pool.execute(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    phone VARCHAR(20),
    qq VARCHAR(20),
    bio TEXT,
    location VARCHAR(255),
    avatar LONGTEXT,
    registerTime VARCHAR(255)
  )`);

  // 错题表
  await pool.execute(`CREATE TABLE IF NOT EXISTS user_errors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    question_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    user_answer VARCHAR(10) NOT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
  )`);

  // 确保用户表中有 admin 账号
  const [adminExists] = await pool.execute('SELECT * FROM users WHERE username = ?', ['admin']);
  if (adminExists.length === 0) {
    const hashedPwd = await bcrypt.hash('123456', 10);
    await pool.execute(
      'INSERT INTO users (username, password, registerTime) VALUES (?, ?, ?)',
      ['admin', hashedPwd, new Date().toLocaleString()]
    );
  }

  // 修复字段类型（如果有必要）
  try {
    await pool.execute(`ALTER TABLE users MODIFY avatar LONGTEXT`);
    await pool.execute(`ALTER TABLE questions MODIFY question_type VARCHAR(50) DEFAULT '单选题'`);
  } catch (err) {
    // 忽略，可能已经存在
  }
};