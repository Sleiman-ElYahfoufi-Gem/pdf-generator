import * as userRepository from '../repositories/user.repository.js';

export const getAllUsers = async () => {
  const users = await userRepository.getAllUsers();
  
  if (!users || users.length === 0) {
    throw new Error("No users found");
  }
  
  return users;
};