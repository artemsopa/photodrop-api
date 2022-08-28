import {
  NextFunction, Response, Router,
} from 'express';
import { AuthRequest, getUserId } from '../handler';
import { IAlbumsService } from '../../service/service';

class AlbumsRoute {
  constructor(private albumsService: IAlbumsService) {
    this.albumsService = albumsService;
  }

  initRoutes() {
    return Router()
      .get('/', this.getAll.bind(this));
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
    // const userId = await getUserId(req);
    // // const body = await signInSchema.validateAsync(req.body);
    // try {
    //   // if (body.error) throw new ApiError(400, body.error.details[0].message);
    //   const token = await this.albumsService.create(userId, userId);
    //   res.status(201).json({ token });
    // } catch (error) {
    //   next(error);
    // }
  }
}

export default AlbumsRoute;
