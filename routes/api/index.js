import express from 'express';
import apiRoutes from './apiRoutes.js';
import emailRoutes from './emailRoutes.js';

const router = express.Router();

// Email routes
router.use('/email', emailRoutes);

// General API proxy routes (keep this last as it has a catch-all route)
router.use('/', apiRoutes);

export default router;
