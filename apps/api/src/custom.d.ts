import { User } from './types';

declare module 'express' {
  interface Request {
    user?: User;
  }
}

export interface User {
    id: number;
    email: string;
    role: string;
  }
  