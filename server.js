import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './src/routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Что-то пошло не так!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});