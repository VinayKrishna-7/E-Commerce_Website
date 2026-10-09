const errorMiddleware = (err, req, res, next) => {
  console.error('[API Error]:', err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
};

module.exports = errorMiddleware;
