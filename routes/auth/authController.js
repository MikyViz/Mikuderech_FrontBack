import axios from 'axios';
import config from '../../config/config.js';

/**
 * User authentication controller
 */
export const authController = async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!config.apiBaseUrl) {
      throw new Error('API_BASE_URL is not defined in configuration');
    }
    
    const apiUrl = `${config.apiBaseUrl}md/Login`;
    console.log('User authentication');
    
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
    console.error('Authentication error:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error during authentication'
    });
  }
};
