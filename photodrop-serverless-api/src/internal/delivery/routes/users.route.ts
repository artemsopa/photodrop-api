import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IUsersService } from '../../service/service';
import { AuthMiddleware } from '../middlewares/auth.middleware';

class UsersRoute {
  constructor(private usersService: IUsersService, private authMiddleware: AuthMiddleware) {
    this.usersService = usersService;
    this.authMiddleware = authMiddleware;
  }

  initRoutes() {
    return Router()
      .get('/', this.getAll.bind(this));
  }

  private async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.usersService.getAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
}

export default UsersRoute;
