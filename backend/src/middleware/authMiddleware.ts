import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { sendError } from '../utils/response';
import { prisma } from '../config/prisma';

export interface AuthRequest extends Request {
  user?: TokenPayload & { name?: string };
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    // Verify user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user || user.status === 'BLOCKED') {
      return sendError(res, 'Account is inactive or not found.', 403);
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    next();
  } catch (error: any) {
    return sendError(res, 'Invalid or expired token. Please log in again.', 401);
  }
}
