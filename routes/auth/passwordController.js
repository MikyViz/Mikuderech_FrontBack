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
        message: 'הקוד נשלח. אנא המתן להודעת SMS.'
      });
    } else {
      // If API returned error
      return res.status(400).json({
        status: 'error',
        message: apiResponse.data.Data?.Message || 'יצירת הקוד נכשלה'
      });
    }
    
  } catch (error) {
    console.error('Password generation error:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({
        status: 'error',
        message: 'שגיאה מה-API: ' + (error.response.data?.Data?.Message || 'שגיאה לא ידועה')
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'שגיאת שרת פנימית'
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
        message: 'קוד לא נמצא או פג תוקף. בקש קוד חדש.'
      });
    }
    
    // Check expiration (5 minutes)
    const fiveMinutes = 5 * 60 * 1000;
    if (Date.now() - stored.timestamp > fiveMinutes) {
      passwordStorage.delete(phoneNumber);
      return res.status(400).json({
        status: 'error',
        message: 'הקוד פג תוקף. בקש קוד חדש.'
      });
    }
    
    // Check match
    if (stored.password === password) {
      // Delete used code
      passwordStorage.delete(phoneNumber);
      return res.json({
        status: 'success',
        message: 'האימות הצליח'
      });
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'קוד אימות שגוי'
      });
    }
    
  } catch (error) {
    console.error('Error verifying password:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'שגיאת שרת פנימית'
    });
  }
};
