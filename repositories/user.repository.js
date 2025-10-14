import { query } from '../database/db.js';

export const findByClientIdAndEmail = async (clientId, email) => {
  const result = await query(
    'SELECT * FROM users WHERE client_id = $1 AND email = $2',
    [clientId, email]
  );
  return result.rows[0] || null;
};

export const getAllUsers = async () => {
  const result = await query(
    'SELECT id, client_id, email, created_at FROM users ORDER BY created_at DESC'
  );
  return result.rows;
};

export const findById = async (userId) => {
  const result = await query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );
  return result.rows[0] || null;
};

export const createUser = async (clientId, secretKey, email) => {
  const result = await query(
    'INSERT INTO users (client_id, secret_key, email) VALUES ($1, $2, $3) RETURNING *',
    [clientId, secretKey, email]
  );
  return result.rows[0];
};