import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IPhotosService } from '../../service/service';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import validateSchema from './joi-schemas/schema';
import { insertPhotosSchema, getSignedUrlSchema } from './joi-schemas/photo.schema';

class PhotosRoute {
  constructor(private photosService: IPhotosService, private authMiddleware: AuthMiddleware) {
    this.photosService = photosService;
    this.authMiddleware = authMiddleware;
  }

  initRoutes() {
    return Router()
      .post('/s3url', this.createUploadUrl.bind(this))
      .post('/', this.createMany.bind(this));
  }

  private async createUploadUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const cameristId = this.authMiddleware.getCameristId(req);
      const body = validateSchema(getSignedUrlSchema, req.body);
      const result = await this.photosService.createUploadUrl(cameristId, body.albumId, body.contentType);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  private async createMany(req: Request, res: Response, next: NextFunction) {
    try {
      const cameristId = this.authMiddleware.getCameristId(req);
      const body = validateSchema(insertPhotosSchema, req.body);
      res.status(200).json({ cameristId, body });
    } catch (error) {
      next(error);
    }
  }
}

export default PhotosRoute;
