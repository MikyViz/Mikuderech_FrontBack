import axios from 'axios';
import config from '../../config/config.js';
import { passwordStorage } from '../../services/passwordService.js';

/**
 * Generates and sends password to user
 */
export const generatePassword = async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!config.apiBaseUrl) {
      throw new Error('API_BASE_URL is not defined in configuration');
    }
    
    const apiUrl = `${config.apiBaseUrl}md/GeneratePasswordForUser`;
    console.log('Generating password for:', data.PhoneNumber);
    
    const requestData = { ...data };
    if (!requestData.UserId) {
      requestData.UserId = config.userId;
    }
    
    const apiResponse = await axios.post(apiUrl, {
      userName: config.apiCredentials.userName,
      password: config.apiCredentials.password,
      data: requestData
    });

    // Check success
    if (apiResponse.data.Result === 1 && apiResponse.data.Data) {
      const { PhoneNumber, Password } = apiResponse.data.Data;
      
      // Save code for 5 minutes
      passwordStorage.set(PhoneNumber, {
        password: Password,
        timestamp: Date.now()
      });
      
      console.log(`Code for ${PhoneNumber} saved for 5 minutes`);
      console.log(`API Response:`, apiResponse.data);
      
      // Send only status to frontend
      return res.json({
        status: 'success',
        message: 'code sent. Please wait for SMS.'
      });
    } else {
      // If API returned error
      return res.status(400).json({
        status: 'error',
        message: apiResponse.data.Data?.Message || 'Failed to generate code'
      });
    }
    
  } catch (error) {
    console.error('Password generation error:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({
        status: 'error',
        message: 'Error from API: ' + (error.response.data?.Data?.Message || 'Unknown error')
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

/**
 * Verifies user-entered password
 */
export const verifyPassword = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body.data;
    
    const stored = passwordStorage.get(phoneNumber);
    
    if (!stored) {
      return res.status(400).json({
        status: 'error',
        message: 'code not found or expired. Request a new code.'
      });
    }
    
    // Check expiration (5 minutes)
    const fiveMinutes = 5 * 60 * 1000;
    if (Date.now() - stored.timestamp > fiveMinutes) {
      passwordStorage.delete(phoneNumber);
      return res.status(400).json({
        status: 'error',
        message: 'code expired. Request a new code.'
      });
    }
    
    // Check match
    if (stored.password === password) {
      // Delete used code
      passwordStorage.delete(phoneNumber);
      return res.json({
        status: 'success',
        message: 'success verification'
      });
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'invalid verification code'
      });
    }
    
  } catch (error) {
    console.error('Error verifying password:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};
