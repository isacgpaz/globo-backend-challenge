import { User } from '@prisma/client';
import { Request } from 'express';

declare global {
  interface RequestWithUser extends Request {
    user: User;
  }
}