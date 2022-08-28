import { IAuthManager } from '../../pkg/auth/auth';
import Repositories from '../repository/repository';
import { AlbumInfo, AlbumInput } from './dtos/album';
import { ImageInput, ImageInfo } from './dtos/image';
import AuthService from './auth.service';
import AlbumsService from './albums.service';
import ImagesService from './images.service';

export interface IAuthService {
    signIn(login: string, password: string): Promise<string>;
}

export interface IAlbumsService {
    getAll(userId: string): Promise<AlbumInfo[]>;
    create(userId: string, album: AlbumInput): Promise<void>;
}

export interface IImagesService {
    getAll(userId: string, albumId: string): Promise<ImageInfo[]>;
    create(userId: string, image: ImageInput): Promise<void>;
}

export class Deps {
  repos: Repositories;
  authManager: IAuthManager;
  constructor(repos: Repositories, authManager: IAuthManager) {
    this.repos = repos;
    this.authManager = authManager;
  }
}

export default class Services {
  auth: IAuthService;
  almubs: IAlbumsService;
  images: IImagesService;
  constructor(deps: Deps) {
    this.auth = new AuthService(deps.repos.users, deps.authManager);
    this.almubs = new AlbumsService(deps.repos.albums);
    this.images = new ImagesService(deps.repos.images);
  }
}
