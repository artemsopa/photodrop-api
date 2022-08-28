import express, {
  NextFunction, Request, Response, Router,
} from 'express';
import cors from 'cors';
import Services from '../service/service';
import errorMiddleware from './middlewares/error.middleware';
import notfMiddleware from './middlewares/notf.middleware';
import AuthRoute from './routes/auth.route';
import AlbumsRoute from './routes/albums.route';
import { AuthManager } from '../../pkg/auth/jwt';
import ApiError from '../domain/error';
import { idSchema } from './routes/joi-schemas/auth.schema';
import UsersRoute from './routes/users.route';

export interface AuthRequest extends Request {
  userId?: string;
}

class Handler {
  constructor(private services: Services, private authManager: AuthManager) {
    this.services = services;
    this.authManager = authManager;
  }

  initHandler() {
    return express()
      .use(cors())
      .use(express.json())
      .use(this.initRoutes())
      .use(errorMiddleware)
      .use(notfMiddleware);
  }

  private initRoutes() {
    return Router()
      .use('/auth', new AuthRoute(this.services.auth).initRoutes())
      .use('/albums', this.authMiddleware, new AlbumsRoute(this.services.almubs).initRoutes())
      .use('/users', new UsersRoute(this.services.users).initRoutes());
  }

  private authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.unauthorized());
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(ApiError.unauthorized());
    }
    const userId = this.authManager.verifyToken(token);
    if (!userId) {
      return next(ApiError.unauthorized());
    }
    req.userId = userId;
    next();
  };
}

export const getUserId = async (req: AuthRequest) => {
  const userId = await idSchema.validateAsync(req);
  if (userId.error) throw ApiError.unauthorized();
  return userId as string;
};

export default Handler;
