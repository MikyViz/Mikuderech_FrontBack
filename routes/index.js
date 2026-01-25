import express from 'express';
import authRoutes from './auth/authRoutes.js';
import apiRoutes from './api/apiRoutes.js';

const router = express.Router();

// Подключаем роуты для аутентификации
router.use('/auth', authRoutes);

// Подключаем роуты для API
router.use('/api', apiRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

export default router;
