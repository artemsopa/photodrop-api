import { Request } from 'express';
import { IAuthManager } from '../../../pkg/auth/auth';
import ApiError from '../../domain/error';

export class AuthMiddleware {
  constructor(private authManager: IAuthManager) {
    this.authManager = authManager;
  }

  getCameristId(req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw ApiError.unauthorized();
    const token = authHeader.split(' ')[1];
    if (!token) throw ApiError.unauthorized();
    const cameristId = this.authManager.verifyToken(token);
    if (!cameristId) throw ApiError.unauthorized();
    return cameristId;
  };
}
