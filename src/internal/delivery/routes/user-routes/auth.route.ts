import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IAuthUsersService } from '../../../services/services';
import { phoneSchema, verifySchema } from '../joi-schemas/auth.schema';
import validateSchema from '../joi-schemas/schema';

class AuthUsersRoute {
  constructor(private authService: IAuthUsersService) {
    this.authService = authService;
  }

  initRoutes() {
    return Router()
      .post('/send-code', this.sendVerificationCode.bind(this))
      .post('/verify-user', this.verifyUser.bind(this));
  }

  private async sendVerificationCode(req: Request, res: Response, next: NextFunction) {
    try {
      const body = validateSchema(phoneSchema, req.body);
      await this.authService.sendVerificationCode(body.phone);
      res.status(200).json({ message: `Verification code successfully sent to ${body.phone}.` });
    } catch (error) {
      next(error);
    }
  }

  private async verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const body = validateSchema(verifySchema, req.body);
      const token = await this.authService.verifyUser(body.phone, body.code);
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthUsersRoute;
