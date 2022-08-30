import express, { Router } from 'express';
import cors from 'cors';
import Services from '../service/service';
import errorMiddleware from './middlewares/error.middleware';
import notfMiddleware from './middlewares/notf.middleware';
import AuthRoute from './routes/auth.route';
import AlbumsRoute from './routes/albums.route';
import { IAuthManager } from '../../pkg/auth/auth';
import { AuthMiddleware } from './middlewares/auth.middleware';
import UsersRoute from './routes/users.route';
import PhotosRoute from './routes/photos.route';

class Handler {
  constructor(private services: Services, private authManager: IAuthManager) {
    this.services = services;
    this.authManager = authManager;
  }

  initHandler() {
    // local
    // const app = express();
    // app.use(cors())
    //   .use(express.json())
    //   .use(this.initRoutes())
    //   .use(errorMiddleware)
    //   .use(notfMiddleware);
    // app.listen(3000, () => {
    //   console.log(`Server is running at https://localhost:${3000}`);
    // });

    // prod
    return express()
      .use(cors())
      .use(express.json())
      .use(this.initRoutes())
      .use(errorMiddleware)
      .use(notfMiddleware);
  }

  private initRoutes() {
    const authMiddleware = new AuthMiddleware(this.authManager);
    return Router()
      .use('/auth', new AuthRoute(this.services.auth).initRoutes())
      .use('/users', new UsersRoute(this.services.users).initRoutes())
      .use('/albums', new AlbumsRoute(this.services.almubs, authMiddleware).initRoutes())
      .use('/photos', new PhotosRoute(this.services.photos, authMiddleware).initRoutes());
  }
}

export default Handler;
