import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IGalleryService } from '../../../services/services';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { idReqSchema } from '../joi-schemas/gallery.schema';
import validateSchema from '../joi-schemas/schema';

class GalleryRoute {
  constructor(private galleryService: IGalleryService, private authMiddleware: AuthMiddleware) {
    this.galleryService = galleryService;
    this.authMiddleware = authMiddleware;
  }

  initRoutes() {
    return Router()
      .get('/', this.getAll.bind(this))
      .get('/album', this.getAllByAlbum.bind(this))
      .put('/album', this.payForAlbum.bind(this));
  }

  private async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.authMiddleware.getId(req);
      const photos = await this.galleryService.getAllByUser(userId);
      res.status(200).json(photos);
    } catch (error) {
      next(error);
    }
  }

  private async getAllByAlbum(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.authMiddleware.getId(req);
      const query = validateSchema(idReqSchema, req.query);
      const album = await this.galleryService.getAllPhotosByAlbum(userId, query.id);
      res.status(200).json(album);
    } catch (error) {
      next(error);
    }
  }

  private async payForAlbum(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.authMiddleware.getId(req);
      const query = validateSchema(idReqSchema, req.query);
      await this.galleryService.payForAlbum(userId, query.id);
      res.status(200).json({ message: 'Album paid for successfully!' });
    } catch (error) {
      next(error);
    }
  }
}

export default GalleryRoute;
