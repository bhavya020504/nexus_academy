import type { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("===== BACKEND ERROR =====");
  console.error(err);
  console.error(err.stack);

  const status = err.status ?? 500;

  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
  });
};
