import {
  NextFunction, Response, Router,
} from 'express';
import { AuthRequest, getUserId } from '../handler';
import { IAlbumsService } from '../../service/service';
import { albumSchema } from './joi-schemas/album.schema';
import validateSchema from './joi-schemas/schema';

class AlbumsRoute {
  constructor(private albumsService: IAlbumsService) {
    this.albumsService = albumsService;
  }

  initRoutes() {
    return Router()
      .get('/', this.getAll.bind(this))
      .post('/', this.create.bind(this));
  }

  private async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = await getUserId(req);
      const albums = await this.albumsService.getAll(userId);
      res.status(201).json(albums);
    } catch (error) {
      next(error);
    }
  }

  private async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = await getUserId(req);
      const body = validateSchema(albumSchema, req.body);
      const token = await this.albumsService.create(userId, body);
      res.status(201).json({ token });
    } catch (error) {
      next(error);
    }
  }
}

export default AlbumsRoute;
