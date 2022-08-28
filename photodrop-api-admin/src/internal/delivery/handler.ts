import express, { Router } from 'express';
import cors from 'cors';
import Services from '../service/service';
import errorMiddleware from './middlewares/error.middleware';
import notfMiddleware from './middlewares/notf.middleware';
import AuthRoute from './routes/auth.route';
import AlbumsRoute from './routes/albums.route';
import { IAuthManager } from '../../pkg/auth/auth';
import { AuthMiddleware } from './middlewares/auth.middleware';

class Handler {
  constructor(private services: Services, private authManager: IAuthManager) {
    this.services = services;
    this.authManager = authManager;
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
    const authMiddleware = new AuthMiddleware(this.authManager);
    return Router()
      .use('/auth', new AuthRoute(this.services.auth).initRoutes())
      .use('/albums', new AlbumsRoute(this.services.almubs, authMiddleware).initRoutes());
  }
}

export default Handler;
