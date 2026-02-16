import express from 'express';
import { authController } from './authController.js';
import { generatePassword, verifyPassword } from './passwordController.js';
import { validateRequest } from '../../middleware/validation.js';

const router = express.Router();

// User authentication
router.post('/auth', authController);

// Password generation for SMS
router.post('/generate-password', validateRequest, generatePassword);

// Verification of entered password
router.post('/verify-password', validateRequest, verifyPassword);

export default router;
