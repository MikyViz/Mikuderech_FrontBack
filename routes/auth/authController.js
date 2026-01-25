import axios from 'axios';
import config from '../../config/config.js';

/**
 * Контроллер аутентификации пользователя
 */
export const authController = async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!config.apiBaseUrl) {
      throw new Error('API_BASE_URL не определен в конфигурации');
    }
    
    const apiUrl = `${config.apiBaseUrl}md/Login`;
    console.log('Аутентификация пользователя');
    
    const requestData = { ...data };
    if (!requestData.UserId) {
      requestData.UserId = config.userId;
    }
    
    const apiResponse = await axios.post(apiUrl, {
      userName: config.apiCredentials.userName,
      password: config.apiCredentials.password,
      data: requestData
    });

    res.json(apiResponse.data);
    
  } catch (error) {
    console.error('Ошибка аутентификации:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при аутентификации'
    });
  }
};
