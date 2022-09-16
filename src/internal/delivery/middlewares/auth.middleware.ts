import { Request } from 'express';
import { IAuthManager } from '../../../pkg/auth/auth';
import ApiError from '../../../pkg/error/api.error';

export class AuthMiddleware {
  constructor(private authManager: IAuthManager) {
    this.authManager = authManager;
  }

  getId(req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw ApiError.unauthorized();
    const token = authHeader.split(' ')[1];
    if (!token) throw ApiError.unauthorized();
    const id = this.authManager.verifyToken(token);
    if (!id) throw ApiError.unauthorized();
    return id;
  };
}
