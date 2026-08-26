import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { sendError } from '../utils/response';

export function authorizeRoles(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required.', 401);
    }

    const userRole = req.user.role.toUpperCase();
    const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());

    if (!normalizedAllowed.includes(userRole) && userRole !== 'ADMIN') {
      return sendError(
        res,
        `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`,
        403
      );
    }

    next();
  };
}
