export function authorize(...roles) {
  return (request, response, next) => {
    if (!request.authUser || !roles.includes(request.authUser.role)) {
      return response.status(403).json({ error: 'You are not allowed to perform this action.' });
    }
    return next();
  };
}
