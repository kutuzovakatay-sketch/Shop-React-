import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../utils/database';

// Получить всех пользователей (только для админа)
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, isAdmin, created_at FROM users ORDER BY id'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Ошибка получения пользователей:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удалить пользователя (только для админа)
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // Не даём удалить самого себя
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'Нельзя удалить самого себя' });
    }
    
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Пользователь удалён' });
  } catch (error) {
    console.error('❌ Ошибка удаления пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};