import axios from 'axios';
import config from '../../config/config.js';
import { passwordStorage } from '../../services/passwordService.js';

/**
 * Генерирует и отправляет пароль пользователю
 */
export const generatePassword = async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!config.apiBaseUrl) {
      throw new Error('API_BASE_URL не определен в конфигурации');
    }
    
    const apiUrl = `${config.apiBaseUrl}md/GeneratePasswordForUser`;
    console.log('Генерация пароля для:', data.PhoneNumber);
    
    const requestData = { ...data };
    if (!requestData.UserId) {
      requestData.UserId = config.userId;
    }
    
    const apiResponse = await axios.post(apiUrl, {
      userName: config.apiCredentials.userName,
      password: config.apiCredentials.password,
      data: requestData
    });

    // Проверяем успешность
    if (apiResponse.data.Result === 1 && apiResponse.data.Data) {
      const { PhoneNumber, Password } = apiResponse.data.Data;
      
      // Сохраняем код на 5 минут
      passwordStorage.set(PhoneNumber, {
        password: Password,
        timestamp: Date.now()
      });
      
      console.log(`Код для ${PhoneNumber} сохранен на 5 минут`);
      console.log(`Ответ API:`, apiResponse.data);
      
      // Отправляем только статус на фронт
      return res.json({
        status: 'success',
        message: 'Код отправлен. Ожидайте SMS.'
      });
    } else {
      // Если API вернул ошибку
      return res.status(400).json({
        status: 'error',
        message: apiResponse.data.Data?.Message || 'Не удалось сгенерировать код'
      });
    }
    
  } catch (error) {
    console.error('Ошибка генерации пароля:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({
        status: 'error',
        message: 'Ошибка при генерации кода'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при генерации кода'
    });
  }
};

/**
 * Проверяет введенный пользователем пароль
 */
export const verifyPassword = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body.data;
    
    const stored = passwordStorage.get(phoneNumber);
    
    if (!stored) {
      return res.status(400).json({
        status: 'error',
        message: 'Код не найден или истек. Запросите новый код.'
      });
    }
    
    // Проверяем срок действия (5 минут)
    const fiveMinutes = 5 * 60 * 1000;
    if (Date.now() - stored.timestamp > fiveMinutes) {
      passwordStorage.delete(phoneNumber);
      return res.status(400).json({
        status: 'error',
        message: 'Код истек. Запросите новый код.'
      });
    }
    
    // Проверяем совпадение
    if (stored.password === password) {
      // Удаляем использованный код
      passwordStorage.delete(phoneNumber);
      return res.json({
        status: 'success',
        message: 'Код подтвержден'
      });
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Неверный код'
      });
    }
    
  } catch (error) {
    console.error('Ошибка проверки пароля:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при проверке кода'
    });
  }
};
