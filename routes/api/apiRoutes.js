import express from 'express';
import axios from 'axios';
import config from '../../config/config.js';
import { validateRequest } from '../../middleware/validation.js';

const router = express.Router();

/**
 * Controller for general API requests
 * Handles all requests to external API
 */
router.post('/:endpoint', validateRequest, async (req, res) => {
  try {
    const { endpoint } = req.params;
    const { data } = req.body;
    
    // Validate apiBaseUrl
    if (!config.apiBaseUrl) {
      throw new Error('API_BASE_URL is not defined in configuration');
    }
    
    // Fixed URL format - added 'md/' segment
    const apiUrl = `${config.apiBaseUrl}md/${endpoint}`;
    console.log('Sending request to:', apiUrl);
    
    // Add UserId to data if it's not there
    const requestData = { ...data };
    if (!requestData.UserId) {
      requestData.UserId = config.userId;
    }
    
    console.log('Data being sent:', requestData);
    
    // Form request to external API
    console.time('API Request Time');
    const apiResponse = await axios.post(apiUrl, {
      userName: config.apiCredentials.userName,
      password: config.apiCredentials.password,
      data: requestData
    });
    console.timeEnd('API Request Time');

    // Return result to client
    res.json(apiResponse.data);
  } catch (error) {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('API Response Error:', error.response.data);
    }
    console.error('Config:', config);
    
    // Return error if it's from API
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Error accessing API',
      error: error.message
    });
  }
});

export default router;
