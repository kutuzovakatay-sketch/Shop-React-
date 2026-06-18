import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './utils/database';
import authRoutes from './routes/authRoutes';
import cartRoutes from './routes/cartRoutes';
import productRoutes from './routes/productRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


const allowedOrigins = [
  'http://localhost:5173',                         
  'https://knitten-shop.vercel.app',               
  
];

app.use(cors({
  origin: function (origin, callback) {
    
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,               
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Проверка подключения к БД
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'OK', time: result.rows[0].now });
  } catch (error) {
    console.error(' Health check error:', error);
    res.status(500).json({ status: 'ERROR', message: 'Database connection failed' });
  }
});

// Подключаем маршруты
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);

// Запуск сервера
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});