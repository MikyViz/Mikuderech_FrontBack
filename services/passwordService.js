/**
 * Временное хранилище для кодов подтверждения
 * Структура: телефон -> {password, timestamp}
 */
export const passwordStorage = new Map();

/**
 * Очистка старых кодов (старше 5 минут)
 */
export const initPasswordCleanup = () => {
  setInterval(() => {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    for (const [phone, data] of passwordStorage.entries()) {
      if (now - data.timestamp > fiveMinutes) {
        passwordStorage.delete(phone);
        console.log(`Код для ${phone} удален (истек срок)`);
      }
    }
  }, 60000); // Проверка каждую минуту
};
