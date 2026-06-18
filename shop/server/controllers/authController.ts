import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../utils/database';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('📝 Регистрация:', { name, email });
    
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // ВНИМАНИЕ: isadmin (все строчные) - имя колонки в БД
    const result = await pool.query(
      'INSERT INTO users (name, email, password, isadmin) VALUES ($1, $2, $3, $4) RETURNING id, name, email, isadmin',
      [name, email, hashedPassword, false]
    );
    
    const user = result.rows[0];
    console.log('✅ Создан пользователь:', user);
    
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isadmin },  // ← isadmin из БД
      process.env.JWT_SECRET || 'my_super_secret_key_123',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        isAdmin: user.isadmin  // ← isadmin из БД
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
    
    console.log('🔑 Вход:', { email });
    
    // ВНИМАНИЕ: isadmin (все строчные) - имя колонки в БД
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }
    
    const user = result.rows[0];
    console.log('👤 Найден пользователь:', { 
      id: user.id, 
      email: user.email, 
      isAdmin: user.isadmin  // ← isadmin из БД
    });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isadmin },  // ← isadmin из БД
      process.env.JWT_SECRET || 'my_super_secret_key_123',
      { expiresIn: '7d' }
    );
    
    // ВНИМАНИЕ: isAdmin (с большой A) - для фронтенда
    const responseData = {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isadmin  // ← isadmin из БД, но в ответе isAdmin
      }
    };
    
    console.log('✅ Ответ:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('❌ Ошибка входа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};