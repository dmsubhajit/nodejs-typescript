import { Response } from 'express';

export function sendSuccess(res: Response, data: unknown) {
  res.json({ success: true, data });
}

export function sendError(res: Response, error: string, status = 400) {
  res.status(status).json({ success: false, error });
}
