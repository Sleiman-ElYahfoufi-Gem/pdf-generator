import { query } from '../database/db.js';

export const findByClientIdAndEmail = async (clientId, email) => {
  const result = await query(
    'SELECT * FROM users WHERE client_id = $1 AND email = $2',
    [clientId, email]
  );
  return result.rows[0] || null;
};

export const findById = async (userId) => {
  const result = await query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );
  return result.rows[0] || null;
};

export const createUser = async (clientId, hashedSecretKey, email) => {
  const result = await query(
    'INSERT INTO users (client_id, secret_key, email) VALUES ($1, $2, $3) RETURNING *',
    [clientId, hashedSecretKey, email]
  );
  return result.rows[0];
};