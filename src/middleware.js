const validateRequest = (req, res, next) => {
  // Проверка необходимых полей в запросе
  if (!req.body || !req.body.data) {
    return res.status(400).json({
      status: 'error',
      message: 'Отсутствуют необходимые данные в запросе'
    });
  }
  console.timeEnd('validateRequest');
  next();
};

module.exports = {
  validateRequest
};