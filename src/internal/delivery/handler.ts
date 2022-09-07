import express, { Router } from 'express';
import cors from 'cors';
import Services from '../services/services';
import errorMiddleware from './middlewares/error.middleware';
import notfMiddleware from './middlewares/notf.middleware';
import { IAuthManager } from '../../pkg/auth/auth';
import { AuthMiddleware } from './middlewares/auth.middleware';
import AuthPhgraphsRoute from './routes/phgraphs-routes/auth.route';
import UsersRoute from './routes/phgraphs-routes/users.route';
import AlbumsRoute from './routes/phgraphs-routes/albums.route';
import PhotosRoute from './routes/phgraphs-routes/photos.route';
import AuthUsersRoute from './routes/user-routes/auth.route';
import GalleryRoute from './routes/user-routes/gallery.route';
import ProfileRoute from './routes/user-routes/profile.route';

class Handler {
  private authMware: AuthMiddleware;
  constructor(private services: Services, authManager: IAuthManager) {
    this.services = services;
    this.authMware = new AuthMiddleware(authManager);
  }

  initHandler() {
    return express()
      .use(cors())
      .use(express.json())
      .use(this.initRoutes())
      .use(errorMiddleware)
      .use(notfMiddleware);
  }

  private initRoutes() {
    return Router()
      .use('/phgraphs', this.initPhgraphRoutes())
      .use('/users', this.initUserRoutes());
  }

  private initPhgraphRoutes() {
    return Router()
      .use('/auth', new AuthPhgraphsRoute(this.services.authPhgrapgs).initRoutes())
      .use('/users', new UsersRoute(this.services.users).initRoutes())
      .use('/albums', new AlbumsRoute(this.services.almubs, this.authMware).initRoutes())
      .use('/photos', new PhotosRoute(this.services.photos, this.authMware).initRoutes());
  }

  private initUserRoutes() {
    return Router()
      .use('/auth', new AuthUsersRoute(this.services.authUsers).initRoutes())
      .use('/profile', new ProfileRoute(this.services.profile, this.authMware).initRoutes())
      .use('/gallery', new GalleryRoute(this.services.gallery, this.authMware).initRoutes());
  }
}

export default Handler;
