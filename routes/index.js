import express from 'express';
import authRoutes from './auth/authRoutes.js';
import apiRoutes from './api/index.js';

const router = express.Router();

// Connect authentication routes
router.use('/auth', authRoutes);

// Connect API routes
router.use('/api', apiRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok👌', message: 'השרת רץ🏃‍♂️‍➡️' });
});

export default router;
