import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IAuthService } from '../../service/service';
import { loginSchema } from './joi-schemas/auth.schema';
import validateSchema from './joi-schemas/schema';

class AuthRoute {
  constructor(private authService: IAuthService) {
    this.authService = authService;
  }

  initRoutes() {
    return Router()
      .post('/login', this.login.bind(this));
  }

  private async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = validateSchema(loginSchema, req.body);
      const token = await this.authService.signIn(body.login, body.password);
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthRoute;
