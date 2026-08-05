import type { NextFunction, Request, Response } from 'express';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`) as Error & { status?: number };
  err.status = 404;
  next(err);
};
