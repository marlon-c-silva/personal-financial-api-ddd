import { Request, Response } from 'express';

export interface AppError extends Error {
    statusCode?: number;
}

export function errorHandler(
    error: AppError,
    req: Request,
    res: Response,
): void {
    console.error('Error occurred:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 ? 'Internal server error' : error.message;

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
}