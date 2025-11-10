import logger from '../utils/logger.js';

export const errorHandler = (err, _req, res, _next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
