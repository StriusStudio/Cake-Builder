class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorResponse);
    }

    this.name = this.constructor.name;
  }

  // Static method to create a new instance of ErrorResponse
  static create(message, statusCode) {
    return new ErrorResponse(message, statusCode);
  }

  // Method to send the error response
  send(res) {
    res.status(this.statusCode || 500).json({
      success: false,
      error: this.message || 'Server Error',
    });
  }

  // Method to handle errors in async/await
  static handle(err, req, res, next) {
    let error = { ...err };
    error.message = err.message;

    // Log to console for dev
    console.error(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
      const message = `Resource not found`;
      error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
      const message = 'Duplicate field value entered';
      error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message);
      error = new ErrorResponse(message, 400);
    }

    // JWT Error
    if (err.name === 'JsonWebTokenError') {
      const message = 'Not authorized';
      error = new ErrorResponse(message, 401);
    }

    // JWT Expired
    if (err.name === 'TokenExpiredError') {
      const message = 'Token has expired';
      error = new ErrorResponse(message, 401);
    }

    // Default to 500 server error
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error',
    });
  }
}

export default ErrorResponse;
