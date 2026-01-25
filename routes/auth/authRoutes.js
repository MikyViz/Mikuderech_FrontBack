import express from 'express';
import { authController } from './authController.js';
import { generatePassword, verifyPassword } from './passwordController.js';
import { validateRequest } from '../../middleware/validation.js';

const router = express.Router();

// Аутентификация пользователя
router.post('/auth', authController);

// Генерация пароля для SMS
router.post('/generate-password', validateRequest, generatePassword);

// Проверка введенного пароля
router.post('/verify-password', validateRequest, verifyPassword);

export default router;
