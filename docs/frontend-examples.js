// ===================================
// Frontend Examples
// ===================================

const API_BASE_URL = 'http://localhost:8888';

// ===================================
// 1. SMS CODE GENERATION AND SENDING
// ===================================

/**
 * Sends SMS code to the specified phone number
 */
async function sendSMSCode(phoneNumber) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/generate-password`, {
      data: {
        PhoneNumber: phoneNumber  // For example: "+972501234567"
      }
    });
    
    if (response.data.status === 'success') {
      console.log('✅ SMS code sent!');
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error('❌ SMS sending error:', error.response?.data);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Code sending error'
    };
  }
}

// Usage example:
// const result = await sendSMSCode('+972501234567');

// ===================================
// 2. SMS CODE VERIFICATION
// ===================================

/**
 * Verifies the SMS code entered by the user
 */
async function verifySMSCode(phoneNumber, code) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-password`, {
      data: {
        phoneNumber: phoneNumber,  // For example: "+972501234567"
        password: code             // For example: "123456"
      }
    });
    
    if (response.data.status === 'success') {
      console.log('✅ Code verified!');
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error('❌ Code verification error:', error.response?.data);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Invalid code'
    };
  }
}

// Usage example:
// const result = await verifySMSCode('+972501234567', '123456');

// ===================================
// 3. GENERAL API REQUESTS
// ===================================

/**
 * Universal function for any API requests
 */
async function callAPI(endpoint, data) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/${endpoint}`, {
      data: data
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`❌ API error ${endpoint}:`, error.response?.data);
    return { 
      success: false, 
      error: error.response?.data || 'Server error'
    };
  }
}

// Usage examples:
// const userInfo = await callAPI('GetUserInfo', { UserId: '123' });
// const profile = await callAPI('UpdateProfile', { Name: 'John', Phone: '+972...' });

// ===================================
// 4. COMPLETE AUTHORIZATION EXAMPLE
// ===================================

/**
 * Complete SMS authorization flow
 */
async function loginWithSMS(phoneNumber) {
  // Step 1: Send SMS code
  console.log('📱 Sending SMS code...');
  const sendResult = await sendSMSCode(phoneNumber);
  
  if (!sendResult.success) {
    return { success: false, message: 'Failed to send code' };
  }
  
  // Step 2: User enters code (this should happen in UI)
  // const userEnteredCode = prompt('Enter code from SMS:');
  
  // Step 3: Verify code
  // console.log('🔐 Verifying code...');
  // const verifyResult = await verifySMSCode(phoneNumber, userEnteredCode);
  
  // if (verifyResult.success) {
  //   console.log('✅ Successful authorization!');
  //   return { success: true };
  // } else {
  //   console.log('❌ Invalid code');
  //   return { success: false, message: verifyResult.message };
  // }
}

// ===================================
// 5. AXIOS INSTANCE (RECOMMENDED)
// ===================================

// Create separate instances for different API groups
const authAPI = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: { 'Content-Type': 'application/json' }
});

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' }
});

// Usage:
// authAPI.post('/generate-password', { data: { PhoneNumber: phone } });
// apiClient.post('/GetUserInfo', { data: { UserId: userId } });

// ===================================
// 6. REACT HOOKS EXAMPLE
// ===================================

// import { useState } from 'react';
// import axios from 'axios';

// function useSMSAuth() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   const sendCode = async (phone) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await sendSMSCode(phone);
//       if (result.success) {
//         return true;
//       } else {
//         setError(result.message);
//         return false;
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const verifyCode = async (phone, code) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await verifySMSCode(phone, code);
//       if (result.success) {
//         return true;
//       } else {
//         setError(result.message);
//         return false;
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return { sendCode, verifyCode, loading, error };
// }

// export default useSMSAuth;

// ===================================
// 7. VUE COMPOSITION API EXAMPLE
// ===================================

// import { ref } from 'vue';
// import axios from 'axios';

// export function useSMSAuth() {
//   const loading = ref(false);
//   const error = ref(null);
  
//   const sendCode = async (phone) => {
//     loading.value = true;
//     error.value = null;
//     try {
//       const result = await sendSMSCode(phone);
//       if (!result.success) {
//         error.value = result.message;
//       }
//       return result.success;
//     } finally {
//       loading.value = false;
//     }
//   };
  
//   const verifyCode = async (phone, code) => {
//     loading.value = true;
//     error.value = null;
//     try {
//       const result = await verifySMSCode(phone, code);
//       if (!result.success) {
//         error.value = result.message;
//       }
//       return result.success;
//     } finally {
//       loading.value = false;
//     }
//   };
  
//   return { sendCode, verifyCode, loading, error };
// }
