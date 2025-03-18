import { logger } from "../config/logger.js";

/**
 * Base API Error Class
 */
export class ApiError extends Error {
  constructor(code, statusCode, message, details, errors = [], metadata = {}) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.errors = errors;
    this.metadata = metadata;
    this.name = this.constructor.name;

    // Capture stack trace (only in production)
    if (process.env.NODE_ENV === "production") {
      Error.captureStackTrace(this, this.constructor);
    }

    // Log the error when created
    logger.error({
      message: this.message,
      statusCode: this.statusCode,
      errors: this.errors,
      metadata: this.metadata,
      stack: this.stack,
    });
  }

  /**
   * Standardized error response formatter
   */
  format(res) {
    const response = {
      success: false,
      message: this.message,
      timestamp: new Date().toISOString(),
      correlationId: res.locals?.correlationId || null, // Support for request tracing
    };

    if (this.errors.length > 0) {
      response.errors = this.errors;
    }

    return res.status(this.statusCode).json(response);
  }
}

/**
 * Concrete Error Classes
 */
export class BadRequestError extends ApiError {
  constructor(message, errors = []) {
    super("BAD_REQUEST", 400, message, "Bad Request", errors);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Authentication required") {
    super("UNAUTHORIZED", 401, message, "Unauthorized");
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Insufficient permissions") {
    super("FORBIDDEN", 403, message, "Forbidden");
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super("NOT_FOUND", 404, message, "Resource not found");
  }
}

export class PermissionError extends ApiError {
  constructor(message = "Insufficient permissions") {
    super(
      "PERMISSION_DENIED",
      403,
      message,
      "User does not have permission to access this resource"
    );
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Resource conflict detected") {
    super("CONFLICT", 409, message, "Resource conflict detected");
  }
}

export class ValidationError extends ApiError {
  constructor(message = "Validation Error") {
    super("VALIDATION_ERROR", 422, message, "Validation Error");
  }
}

export class TooManyRequestsError extends ApiError {
  constructor(message = "Too many requests") {
    super("TOO_MANY_REQUESTS", 429, message, "Too many requests");
  }
}

export class InternalServerError extends ApiError {
  constructor(message = "Internal server error") {
    super("INTERNAL_SERVER_ERROR", 500, message, "Internal server error");
  }
}
export class AuthError extends ApiError {
  constructor(message = "Authentication error") {
    super("AUTH_ERROR", 401, message, "Authentication error");
  }
}

/**
 * Type guard for checking if an error is an instance of `ApiError`
 */
export const isApiError = (error) => error instanceof ApiError;
