import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IPhotosService } from '../../../services/services';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { getSignedUrlSchema, idReqSchema, keysSchema } from '../joi-schemas/photo.schema';
import validateSchema from '../joi-schemas/schema';

class PhotosRoute {
  constructor(private photosService: IPhotosService, private authMiddleware: AuthMiddleware) {
    this.photosService = photosService;
    this.authMiddleware = authMiddleware;
  }

  initRoutes() {
    return Router()
      .get('/album', this.getAllByAlbum.bind(this))
      .post('/s3url', this.getUploadUrl.bind(this))
      .post('/', this.createPhotos.bind(this));
  }

  private async getAllByAlbum(req: Request, res: Response, next: NextFunction) {
    try {
      const phgraphId = this.authMiddleware.getId(req);
      const query = validateSchema(idReqSchema, req.query);
      const data = await this.photosService.getUsersAndPhotosByAlbum(phgraphId, query.id);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  private async getUploadUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const phgraphId = this.authMiddleware.getId(req);
      const body = validateSchema(getSignedUrlSchema, req.body);
      const result = await this.photosService.getUploadUrl(phgraphId, body.albumId, body.contentType);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  private async createPhotos(req: Request, res: Response, next: NextFunction) {
    try {
      const phgraphId = this.authMiddleware.getId(req);
      const body = validateSchema(keysSchema, req.body);
      await this.photosService.createMany(phgraphId, body.albumId, body.keys);
      res.status(200).json({ message: 'Photos successfully uploaded!' });
    } catch (error) {
      next(error);
    }
  }
}

export default PhotosRoute;
