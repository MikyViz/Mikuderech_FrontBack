/**
 * Проверяет корректность входящего запроса
 */
export const validateRequest = (req, res, next) => {
  // Проверка необходимых полей в запросе
  if (!req.body || !req.body.data) {
    return res.status(400).json({
      status: 'error',
      message: 'Отсутствуют необходимые данные в запросе'
    });
  }
  
  // Проверка, что data - объект. Если это строка, пытаемся распарсить её как JSON
  if (typeof req.body.data === 'string') {
    try {
      req.body.data = JSON.parse(req.body.data);
    } catch (error) {
      console.error('Ошибка при парсинге data как JSON:', error);
      // Не возвращаем ошибку, продолжаем с данными как есть
    }
  }
  
  next();
};
