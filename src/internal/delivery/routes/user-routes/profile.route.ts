import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IProfileService } from '../../../services/services';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import validateSchema from '../joi-schemas/schema';
import {
  changeEmailSchema, changePhoneSchema, changeFullNameSchema, getAvatarUrlSchema, changeAvatarSchema,
} from '../joi-schemas/profile.schema';

class ProfileRoute {
  constructor(private profileService: IProfileService, private authMiddleware: AuthMiddleware) {
    this.profileService = profileService;
    this.authMiddleware = authMiddleware;
  }

  initRoutes() {
    return Router()
      .get('/', this.getProfile.bind(this))
      .put('/phone', this.changePhone.bind(this))
      .put('/email', this.changeEmail.bind(this))
      .put('/name', this.changeFullName.bind(this))
      .use('/avatar', Router()
        .post('/s3url', this.getAvatarUploadUrl.bind(this))
        .put('/', this.changeAvatar.bind(this)));
  }

  private async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.authMiddleware.getId(req);
      const profile = await this.profileService.getByUser(userId);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }

  private async changePhone(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.authMiddleware.getId(req);
      const body = validateSchema(changePhoneSchema, req.body);
      await this.profileService.updatePhone(userId, body.phone, body.code);
      res.status(200).json({ message: `Phone number successfully changed to ${body.phone}!` });
    } catch (error) {
      next(error);
    }
  }

  private async changeEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.authMiddleware.getId(req);
      const body = validateSchema(changeEmailSchema, req.body);
      await this.profileService.updateEmail(userId, body.email);
      res.status(200).json({ message: `Email successfully changed to ${body.email}!` });
    } catch (error) {
      next(error);
    }
  }

  private async changeFullName(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.authMiddleware.getId(req);
      const body = validateSchema(changeFullNameSchema, req.body);
      await this.profileService.updateFullName(userId, body.fullName);
      res.status(200).json({ message: `Full name successfully changed to ${body.fullName}!` });
    } catch (error) {
      next(error);
    }
  }

  private async getAvatarUploadUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.authMiddleware.getId(req);
      const body = validateSchema(getAvatarUrlSchema, req.body);
      const result = await this.profileService.getUploadAvatarUrl(userId, body.contetType);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  private async changeAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.authMiddleware.getId(req);
      const body = validateSchema(changeAvatarSchema, req.body);
      await this.profileService.updateAvatar(userId, body.key);
      res.status(200).json({ message: 'Avatar successfully updated!' });
    } catch (error) {
      next(error);
    }
  }
}

export default ProfileRoute;
