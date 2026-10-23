export function errorHandler(error, request, response, next) {
  if (response.headersSent) return next(error);
  console.error('API request failed:', error);
  return response.status(error.status || 500).json({
    error: error.status ? error.message : 'An unexpected server error occurred.',
  });
}
