import { getPool } from '../database/connection.js';

export const findAll = async (filters) => {
  let sql = 'SELECT * FROM questions';
  const params = [];
  const conditions = [];

  if (filters.subject) {
    conditions.push('subject = ?');
    params.push(filters.subject);
  }
  if (filters.year) {
    conditions.push('year = ?');
    params.push(filters.year);
  }
  if (filters.type) {
    conditions.push('type = ?');
    params.push(filters.type);
  }
  if (filters.questionType) {
    conditions.push('question_type = ?');
    params.push(filters.questionType);
  }

  if (conditions.length) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  sql += ' ORDER BY id DESC';

  const [rows] = await getPool().execute(sql, params);
  return rows.map(row => ({
    ...row,
    options: row.options ? JSON.parse(row.options) : [],
  }));
};

export const findById = async (id) => {
  const [rows] = await getPool().execute('SELECT * FROM questions WHERE id = ?', [id]);
  if (rows.length === 0) return null;
  const row = rows[0];
  row.options = row.options ? JSON.parse(row.options) : [];
  return row;
};

export const createQuestion = async (data) => {
  const { year, questionIndex, subject, question, options, answer, analysis, difficulty, type, questionType } = data;
  const [result] = await getPool().execute(
    `INSERT INTO questions (year, question_index, subject, question, options, answer, analysis, difficulty, type, question_type)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [year, questionIndex, subject, question, JSON.stringify(options), answer, analysis, difficulty, type, questionType]
  );
  return result.insertId;
};

export const deleteQuestion = async (id) => {
  await getPool().execute('DELETE FROM questions WHERE id = ?', [id]);
};

export const batchDeleteQuestions = async (ids) => {
  if (!ids.length) return 0;
  const placeholders = ids.map(() => '?').join(',');
  const [result] = await getPool().execute(`DELETE FROM questions WHERE id IN (${placeholders})`, ids);
  return result.affectedRows;
};

export const checkUniqueIndex = async (year, questionIndex) => {
  const [rows] = await getPool().execute(
    'SELECT id FROM questions WHERE year = ? AND question_index = ?',
    [year, questionIndex]
  );
  return rows.length > 0;
};

export const getDistinctSubjects = async () => {
  const [rows] = await getPool().execute('SELECT DISTINCT subject FROM questions WHERE subject IS NOT NULL AND subject != ""');
  return rows.map(r => r.subject);
};

export const getDistinctQuestionTypes = async () => {
  const [rows] = await getPool().execute('SELECT DISTINCT question_type FROM questions WHERE question_type IS NOT NULL AND question_type != ""');
  return rows.map(r => r.question_type);
};