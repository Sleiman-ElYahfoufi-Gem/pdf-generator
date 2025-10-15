import { User } from '../models/index.js';

export const findByClientIdAndEmail = async (clientId, email) => {
  const user = await User.findOne({
    where: { clientId, email }
  });
  return user;
};

export const getAllUsers = async () => {
  const users = await User.findAll({
    attributes: ['id', 'clientId', 'email', 'createdAt'],
    order: [['createdAt', 'DESC']]
  });
  return users;
};

export const findById = async (userId) => {
  const user = await User.findByPk(userId);
  return user;
};

export const createUser = async (clientId, secretKey, email) => {
  const user = await User.create({
    clientId,
    secretKey,
    email
  });
  return user;
};