import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../utils/database';

// Получить корзину пользователя
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      'SELECT product_id, quantity, added_at FROM cart WHERE user_id = $1 ORDER BY added_at',
      [userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Ошибка получения корзины:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Добавить товар в корзину
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'ID товара обязателен' });
    }
    
    // Проверяем, есть ли уже такой товар в корзине
    const existing = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );
    
    let result;
    if (existing.rows.length > 0) {
      // Обновляем количество
      result = await pool.query(
        'UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
        [quantity, userId, productId]
      );
    } else {
      // Добавляем новый товар
      result = await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [userId, productId, quantity]
      );
    }
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Ошибка добавления в корзину:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Обновить количество товара в корзине
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    // Исправлено: правильно получаем productId
    const productId = parseInt(req.params.productId as string);
    const { quantity } = req.body;
    
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'Некорректный ID товара' });
    }
    
    if (!quantity || quantity < 0) {
      return res.status(400).json({ message: 'Некорректное количество' });
    }
    
    if (quantity === 0) {
      await pool.query(
        'DELETE FROM cart WHERE user_id = $1 AND product_id = $2',
        [userId, productId]
      );
      return res.json({ message: 'Товар удалён из корзины' });
    }
    
    const result = await pool.query(
      'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
      [quantity, userId, productId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Товар не найден в корзине' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Ошибка обновления корзины:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удалить товар из корзины
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    // Исправлено: правильно получаем productId
    const productId = parseInt(req.params.productId as string);
    
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'Некорректный ID товара' });
    }
    
    const result = await pool.query(
      'DELETE FROM cart WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [userId, productId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Товар не найден в корзине' });
    }
    
    res.json({ message: 'Товар удалён из корзины' });
  } catch (error) {
    console.error('❌ Ошибка удаления из корзины:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Очистить всю корзину
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    
    await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);
    
    res.json({ message: 'Корзина очищена' });
  } catch (error) {
    console.error('❌ Ошибка очистки корзины:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};