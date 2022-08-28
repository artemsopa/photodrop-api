import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IAuthService } from '../../service/service';
import { registerSchema, loginSchema } from './joi-schemas/auth.schema';
import { UserInput } from '../../service/dtos/user';
import validateSchema from './joi-schemas/schema';

class AuthRoute {
  constructor(private authService: IAuthService) {
    this.authService = authService;
  }

  initRoutes() {
    return Router()
      .post('/login', this.login.bind(this))
      .post('/register', this.register.bind(this));
  }

  private async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = validateSchema(loginSchema, req.body);
      const token = await this.authService.signIn(body.login, body.password);
      res.status(201).json({ token });
    } catch (error) {
      next(error);
    }
  }

  private async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = validateSchema(registerSchema, req.body);
      await this.authService.signUp(new UserInput(body.login, body.password, body.fullName, body.email));
      res.status(201).json({ message: `User ${body.login} successfully registered!` });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthRoute;
