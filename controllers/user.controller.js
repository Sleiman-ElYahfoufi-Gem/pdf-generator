import { getAllUsers } from '../services/user.service.js';
import logger from '../utils/logger.js';
export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    
    logger.error('Error fetching users:', { error: err });

    res.status(500).json({ success: false, message: error.message });
  }
};