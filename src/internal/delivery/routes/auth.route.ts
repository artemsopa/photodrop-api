import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IAuthService } from '../../service/service';
import { loginSchema, phoneSchema, verifySchema } from './joi-schemas/auth.schema';
import validateSchema from './joi-schemas/schema';

class AuthRoute {
  constructor(private authService: IAuthService) {
    this.authService = authService;
  }

  initRoutes() {
    return Router()
      .post('/login', this.login.bind(this))
      .post('/send-code', this.getVerificationCode.bind(this))
      .post('/verify-user', this.verifyUser.bind(this));
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

  private async getVerificationCode(req: Request, res: Response, next: NextFunction) {
    try {
      const body = validateSchema(phoneSchema, req.body);
      await this.authService.getVerificationCode(body.phone);
      res.status(200).json({ message: `Verification code successfully sent to ${body.phone}.` });
    } catch (error) {
      next(error);
    }
  }

  private async verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const body = validateSchema(verifySchema, req.body);
      const message = await this.authService.verifyUser(body.phone, body.code);
      res.status(200).json({ message });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthRoute;
