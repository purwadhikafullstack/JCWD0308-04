import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from '@/custom';

export class UserMiddleware {
  async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Token is required' });
      }
      const verifiedUser = verify(token, process.env.KEY_JWT!) as User;

      req.user = verifiedUser;
      next();
    } catch (error) {
      res.status(401).json({ error: error });
    }
  }
}
