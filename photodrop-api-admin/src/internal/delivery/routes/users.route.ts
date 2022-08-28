import {
  Router, Request, Response, NextFunction,
} from 'express';
import { IUsersService } from '../../service/service';

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
      res.status(201).json(users);
    } catch (error) {
      next(error);
    }
  }
}

export default UsersRoute;
