import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from '@/custom'

export class UserMiddleware {
  async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      let token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        throw new Error('Token is empty');
      }

      const verifiedUser = verify(token, process.env.KEY_JWT!) as User;
      req.user = verifiedUser;
      next();
    } catch (error) {
      res.status(400).json({ error: 'Error Middleware' });
    }
  }
}
