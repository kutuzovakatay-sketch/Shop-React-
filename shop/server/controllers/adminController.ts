import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../utils/database';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    
    const result = await pool.query(
      'SELECT id, name, email, isadmin, created_at FROM users ORDER BY id',
      []
    );
    res.json(result.rows);
  } catch (error) {
    console.error(' Ошибка получения пользователей:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    
    const userId = parseInt(req.params.id as string);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Некорректный ID пользователя' });
    }
    
    // Не даём удалить самого себя
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Нельзя удалить самого себя' });
    }
    
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ message: 'Пользователь удалён' });
  } catch (error) {
    console.error(' Ошибка удаления пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};