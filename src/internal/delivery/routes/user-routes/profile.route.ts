import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IProfileService } from '../../../services/services';
import { AuthMiddleware } from '../../middlewares/auth.middleware';

class ProfileRoute {
  constructor(private profileService: IProfileService, private authMiddleware: AuthMiddleware) {
    this.profileService = profileService;
    this.authMiddleware = authMiddleware;
  }

  initRoutes() {
    return Router();
  }
}

export default ProfileRoute;
