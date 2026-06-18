import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../utils/database';

// Получить все товары
export const getProducts = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error(' Ошибка получения товаров:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить товар по ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(' Ошибка получения товара:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Создать товар (только админ)
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { title, img, description, category, price } = req.body;
    
    const result = await pool.query(
      'INSERT INTO products (title, img, description, category, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, img, description, category, price]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(' Ошибка создания товара:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Обновить товар (только админ)
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, img, description, category, price } = req.body;
    
    const result = await pool.query(
      'UPDATE products SET title = $1, img = $2, description = $3, category = $4, price = $5 WHERE id = $6 RETURNING *',
      [title, img, description, category, price, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(' Ошибка обновления товара:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удалить товар (только админ)
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    
    res.json({ message: 'Товар удалён' });
  } catch (error) {
    console.error(' Ошибка удаления товара:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};