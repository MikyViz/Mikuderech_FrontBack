// ===================================
// Примеры для фронтенда
// ===================================

const API_BASE_URL = 'http://localhost:8888';

// ===================================
// 1. ГЕНЕРАЦИЯ И ОТПРАВКА SMS-КОДА
// ===================================

/**
 * Отправляет SMS-код на указанный номер телефона
 */
async function sendSMSCode(phoneNumber) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/generate-password`, {
      data: {
        PhoneNumber: phoneNumber  // Например: "+972501234567"
      }
    });
    
    if (response.data.status === 'success') {
      console.log('✅ SMS-код отправлен!');
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error('❌ Ошибка отправки SMS:', error.response?.data);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Ошибка отправки кода'
    };
  }
}

// Пример использования:
// const result = await sendSMSCode('+972501234567');

// ===================================
// 2. ПРОВЕРКА SMS-КОДА
// ===================================

/**
 * Проверяет введенный пользователем SMS-код
 */
async function verifySMSCode(phoneNumber, code) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-password`, {
      data: {
        phoneNumber: phoneNumber,  // Например: "+972501234567"
        password: code             // Например: "123456"
      }
    });
    
    if (response.data.status === 'success') {
      console.log('✅ Код подтвержден!');
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    console.error('❌ Ошибка проверки кода:', error.response?.data);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Неверный код'
    };
  }
}

// Пример использования:
// const result = await verifySMSCode('+972501234567', '123456');

// ===================================
// 3. ОБЩИЕ API ЗАПРОСЫ
// ===================================

/**
 * Универсальная функция для любых API запросов
 */
async function callAPI(endpoint, data) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/${endpoint}`, {
      data: data
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`❌ Ошибка API ${endpoint}:`, error.response?.data);
    return { 
      success: false, 
      error: error.response?.data || 'Ошибка сервера'
    };
  }
}

// Примеры использования:
// const userInfo = await callAPI('GetUserInfo', { UserId: '123' });
// const profile = await callAPI('UpdateProfile', { Name: 'John', Phone: '+972...' });

// ===================================
// 4. ПОЛНЫЙ ПРИМЕР АВТОРИЗАЦИИ
// ===================================

/**
 * Полный flow авторизации по SMS
 */
async function loginWithSMS(phoneNumber) {
  // Шаг 1: Отправить SMS-код
  console.log('📱 Отправка SMS-кода...');
  const sendResult = await sendSMSCode(phoneNumber);
  
  if (!sendResult.success) {
    return { success: false, message: 'Не удалось отправить код' };
  }
  
  // Шаг 2: Пользователь вводит код (это должно происходить в UI)
  // const userEnteredCode = prompt('Введите код из SMS:');
  
  // Шаг 3: Проверить код
  // console.log('🔐 Проверка кода...');
  // const verifyResult = await verifySMSCode(phoneNumber, userEnteredCode);
  
  // if (verifyResult.success) {
  //   console.log('✅ Успешная авторизация!');
  //   return { success: true };
  // } else {
  //   console.log('❌ Неверный код');
  //   return { success: false, message: verifyResult.message };
  // }
}

// ===================================
// 5. AXIOS INSTANCE (РЕКОМЕНДУЕТСЯ)
// ===================================

// Создаем отдельные instance для разных групп API
const authAPI = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: { 'Content-Type': 'application/json' }
});

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' }
});

// Использование:
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
