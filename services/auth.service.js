import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/user.repository.js';

export const authenticateUser = async (clientId, secretKey, email) => {
  // Get user from database via repository
  const user = await userRepository.findByClientIdAndEmail(clientId, email);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Direct comparison of secret key
  const isValid = secretKey === user.secret_key;
  
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, clientId: user.client_id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { 
    token, 
    user: { 
      id: user.id, 
      clientId: user.client_id, 
      email: user.email 
    } 
  };
};