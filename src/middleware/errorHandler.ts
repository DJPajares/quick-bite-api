import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, number>;
}

/**
 * Global error handler middleware
 */
const errorHandler = (err: MongooseError | MongoError | Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const validationError = err as MongooseError.ValidationError;
    const errors = Object.values(validationError.errors).map(e => e.message);
    res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errors
    });
    return;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      error: 'Invalid ID format'
    });
    return;
  }

  // Duplicate key error
  const mongoError = err as MongoError;
  if (mongoError.code === 11000) {
    res.status(400).json({
      success: false,
      error: 'Duplicate entry',
      field: mongoError.keyPattern ? Object.keys(mongoError.keyPattern)[0] : 'unknown'
    });
    return;
  }

  // Default error
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
};

export default errorHandler;
