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

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'OK', time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: 'Database connection failed' });
  }
});

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes); 

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});