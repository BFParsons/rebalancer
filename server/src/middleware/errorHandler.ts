import type { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(config.env === 'development' && { stack: err.stack }),
    });
  }

  // Database errors
  if (err.message.includes('duplicate key')) {
    return res.status(409).json({ error: 'Resource already exists' });
  }

  if (err.message.includes('foreign key')) {
    return res.status(400).json({ error: 'Referenced resource not found' });
  }

  // CORS error
  if (err.message.includes('CORS')) {
    return res.status(403).json({ error: 'CORS not allowed' });
  }

  // Default server error
  return res.status(500).json({
    error: 'Internal server error',
    ...(config.env === 'development' && {
      message: err.message,
      stack: err.stack,
    }),
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
};
