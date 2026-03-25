import { getPool } from '../database/connection.js';

export const addError = async (userId, questionId, subject, userAnswer) => {
  await getPool().execute(
    `INSERT IGNORE INTO user_errors (user_id, question_id, subject, user_answer) VALUES (?, ?, ?, ?)`,
    [userId, questionId, subject, userAnswer]
  );
};

export const findErrorsByUser = async (userId, subject, questionType) => {
  let sql = `
    SELECT e.*, q.question, q.options, q.answer AS correct_answer, q.analysis, q.year, q.difficulty, q.question_type
    FROM user_errors e
    JOIN questions q ON e.question_id = q.id
    WHERE e.user_id = ?
  `;
  const params = [userId];
  if (subject) {
    sql += ' AND e.subject = ?';
    params.push(subject);
  }
  if (questionType) {
    sql += ' AND q.question_type = ?';
    params.push(questionType);
  }
  sql += ' ORDER BY e.create_time DESC';
  const [rows] = await getPool().execute(sql, params);
  return rows.map(row => ({
    ...row,
    options: row.options ? JSON.parse(row.options) : [],
  }));
};

export const deleteError = async (errorId, userId) => {
  const [result] = await getPool().execute('DELETE FROM user_errors WHERE id = ? AND user_id = ?', [errorId, userId]);
  return result.affectedRows > 0;
};

export const getErrorQuestionsByUser = async (userId, subject, questionType) => {
  let sql = `
    SELECT q.* FROM user_errors e
    JOIN questions q ON e.question_id = q.id
    WHERE e.user_id = ?
  `;
  const params = [userId];
  if (subject) {
    sql += ' AND e.subject = ?';
    params.push(subject);
  }
  if (questionType) {
    sql += ' AND q.question_type = ?';
    params.push(questionType);
  }
  sql += ' ORDER BY e.create_time DESC';
  const [rows] = await getPool().execute(sql, params);
  return rows.map(row => ({
    ...row,
    options: row.options ? JSON.parse(row.options) : [],
  }));
};