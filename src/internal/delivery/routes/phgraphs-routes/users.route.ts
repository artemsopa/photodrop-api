import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IUsersService } from '../../../services/services';

class UsersRoute {
  constructor(private usersService: IUsersService) {
    this.usersService = usersService;
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
