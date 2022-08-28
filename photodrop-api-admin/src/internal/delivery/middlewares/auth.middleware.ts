import { Request } from 'express';
import { IAuthManager } from '../../../pkg/auth/auth';
import ApiError from '../../domain/error';

export class AuthMiddleware {
  constructor(private authManager: IAuthManager) {
    this.authManager = authManager;
  }

  getUserId(req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw ApiError.unauthorized();
    const token = authHeader.split(' ')[1];
    if (!token) throw ApiError.unauthorized();
    const userId = this.authManager.verifyToken(token);
    if (!userId) throw ApiError.unauthorized();
    return userId;
  };
}
