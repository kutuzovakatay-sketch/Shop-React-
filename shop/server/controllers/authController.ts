import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../utils/database';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    // Проверка существования пользователя
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }
    
    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Создание пользователя (по умолчанию isAdmin = false)
    const result = await pool.query(
      'INSERT INTO users (name, email, password, isAdmin) VALUES ($1, $2, $3, $4) RETURNING id, name, email, isAdmin',
      [name, email, hashedPassword, false]  
    );
    
    const user = result.rows[0];
    
    // Создание JWT токена
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },  
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        isAdmin: user.isAdmin  
      } 
    });
  } catch (error) {
    console.error('❌ Ошибка регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Поиск пользователя
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }
    
    const user = result.rows[0];
    
    // Проверка пароля
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }
    
    // Создание JWT токена
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },  
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        isAdmin: user.isAdmin  
      } 
    });
  } catch (error) {
    console.error('❌ Ошибка входа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};