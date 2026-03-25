import { getPool } from '../database/connection.js';

export const findByUsername = async (username) => {
  const [rows] = await getPool().execute('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

export const findById = async (id) => {
  const [rows] = await getPool().execute('SELECT id, username, phone, qq, bio, location, avatar, registerTime FROM users WHERE id = ?', [id]);
  return rows[0];
};

export const createUser = async (userData) => {
  const { username, password, phone, qq, registerTime } = userData;
  const [result] = await getPool().execute(
    'INSERT INTO users (username, password, phone, qq, registerTime) VALUES (?, ?, ?, ?, ?)',
    [username, password, phone, qq, registerTime]
  );
  return result.insertId;
};

export const updateUser = async (id, fields) => {
  const updates = [];
  const values = [];
  if (fields.bio !== undefined) {
    updates.push('bio = ?');
    values.push(fields.bio);
  }
  if (fields.location !== undefined) {
    updates.push('location = ?');
    values.push(fields.location);
  }
  if (fields.avatar !== undefined) {
    updates.push('avatar = ?');
    values.push(fields.avatar);
  }
  if (updates.length === 0) return;
  values.push(id);
  await getPool().execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
};

export const getAllUsers = async () => {
  const [rows] = await getPool().execute('SELECT id, username, phone, qq, bio, location, avatar, registerTime FROM users ORDER BY id DESC');
  return rows;
};

export const deleteUser = async (id) => {
  await getPool().execute('DELETE FROM users WHERE id = ?', [id]);
};