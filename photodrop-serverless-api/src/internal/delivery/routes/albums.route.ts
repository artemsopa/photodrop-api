import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IAlbumsService } from '../../service/service';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { albumSchema } from './joi-schemas/album.schema';
import validateSchema from './joi-schemas/schema';

class AlbumsRoute {
  constructor(private albumsService: IAlbumsService, private authMiddleware: AuthMiddleware) {
    this.albumsService = albumsService;
    this.authMiddleware = authMiddleware;
  }

  initRoutes() {
    return Router()
      .get('/', this.getAll.bind(this))
      .post('/', this.create.bind(this));
  }

  private async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const cameristId = this.authMiddleware.getCameristId(req);
      const albums = await this.albumsService.getAll(cameristId);
      res.status(200).json(albums);
    } catch (error) {
      next(error);
    }
  }

  private async create(req: Request, res: Response, next: NextFunction) {
    try {
      const cameristId = this.authMiddleware.getCameristId(req);
      const body = validateSchema(albumSchema, req.body);
      await this.albumsService.create(cameristId, body);
      res.status(201).json({ message: `Album "${body.title}" successfully created!` });
    } catch (error) {
      next(error);
    }
  }
}

export default AlbumsRoute;
