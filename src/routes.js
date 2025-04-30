import express from 'express';
import axios from 'axios';
import config from './config.js';
import { validateRequest } from './middleware.js';

const router = express.Router();

// Общий обработчик для всех API эндпоинтов
router.post('/:endpoint', validateRequest, async (req, res) => {
  try {
    const { endpoint } = req.params;
    const { data } = req.body;
    
    // Проверка корректности apiBaseUrl
    if (!config.apiBaseUrl) {
      throw new Error('API_BASE_URL не определен в конфигурации');
    }
    
    // Исправлен формат URL - добавлен сегмент 'md/'
    const apiUrl = `${config.apiBaseUrl}md/${endpoint}`;
    console.log('Отправка запроса к:', apiUrl);
    
    // Добавляем UserId в data, если его там нет
    const requestData = { ...data };
    if (!requestData.UserId) {
      requestData.UserId = config.userId;
    }
    
    console.log('Отправляемые данные:', requestData);
    
    // Формируем запрос к внешнему API
    console.time('API Request Time');
    const apiResponse = await axios.post(apiUrl, {
      userName: config.apiCredentials.userName,
      password: config.apiCredentials.password,
      data: requestData // Отправляем объект, а не строку
    });
    console.timeEnd('API Request Time');

    // Возвращаем результат клиенту
    res.json(apiResponse.data);
  } catch (error) {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('API Response Error:', error.response.data);
    }
    console.error('Config:', config);  // Выводим конфигурацию для отладки
    
    // Возвращаем ошибку, если она от API
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при обращении к API',
      error: error.message
    });
  }
});

export default router;