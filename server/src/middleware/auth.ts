import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    console.warn(`[AUTH 401] Missing or invalid Authorization header on ${req.method} ${req.originalUrl}`);
    res.status(401).json({ success: false, message: 'Unauthorized: Missing Authorization header.' });
    return;
  }

  const token = header.replace('Bearer ', '').trim();
  if (!token || token === 'undefined' || token === 'null') {
    console.warn(`[AUTH 401] Empty or malformed token string on ${req.method} ${req.originalUrl}`);
    res.status(401).json({ success: false, message: 'Unauthorized: Invalid token format.' });
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string; email: string };
    req.user = payload;
    next();
  } catch (error: any) {
    console.error(`[AUTH 401] JWT Verification Error on ${req.method} ${req.originalUrl}:`, error.message);
    res.status(401).json({ success: false, message: `Unauthorized: ${error.message}` });
  }
};

