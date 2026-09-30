/** An expected error with an HTTP status, safe to show to the client. */
export default class ApiError extends Error {
  constructor(statusCode, message, errors) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }

  static badRequest(message = 'Bad request.', errors) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Please sign in to continue.') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'You do not have permission to do that.') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Not found.') {
    return new ApiError(404, message);
  }

  static conflict(message) {
    return new ApiError(409, message);
  }

  static unprocessable(message = 'Please check the highlighted fields.', errors) {
    return new ApiError(422, message, errors);
  }
}
