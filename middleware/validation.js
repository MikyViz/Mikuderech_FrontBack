/**
 * Validates incoming request
 */
export const validateRequest = (req, res, next) => {
  // Check required fields in request
  if (!req.body || !req.body.data) {
    return res.status(400).json({
      status: 'error',
      message: 'Required data missing in request'
    });
  }
  
  // Check that data is an object. If it's a string, try to parse it as JSON
  if (typeof req.body.data === 'string') {
    try {
      req.body.data = JSON.parse(req.body.data);
    } catch (error) {
      console.error('Error parsing data as JSON:', error);
      // Don't return error, continue with data as is
    }
  }
  
  next();
};
