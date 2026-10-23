export function errorHandler(error, request, response, next) {
  if (response.headersSent) return next(error);
  console.error('API request failed:', error);

  if (error.name === 'MongoServerError' && error.code === 8000) {
    return response.status(503).json({
      error: 'Database authentication failed. Check the MongoDB database username and password in MONGODB_URI.',
    });
  }
  if (error.name === 'MongooseServerSelectionError') {
    return response.status(503).json({
      error: 'Database is unavailable. Check the MongoDB connection string, cluster status, and Atlas network access.',
    });
  }

  return response.status(error.status || 500).json({
    error: error.status ? error.message : 'An unexpected server error occurred.',
  });
}
