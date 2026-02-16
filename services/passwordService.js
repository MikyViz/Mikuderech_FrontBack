/**
 * Temporary storage for verification codes
 * Structure: phone -> {password, timestamp}
 */
export const passwordStorage = new Map();

/**
 * Cleanup old codes (older than 5 minutes)
 */
export const initPasswordCleanup = () => {
  setInterval(() => {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    for (const [phone, data] of passwordStorage.entries()) {
      if (now - data.timestamp > fiveMinutes) {
        passwordStorage.delete(phone);
        console.log(`Code for ${phone} deleted (expired)`);
      }
    }
  }, 60000); // Check every minute
};
