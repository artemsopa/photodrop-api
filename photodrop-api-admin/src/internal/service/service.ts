import { IAuthManager } from '../../pkg/auth/auth';
import Repositories from '../repository/repository';
import { AlbumInfo, AlbumInput } from './dtos/album';
import { ImageInput, ImageInfo } from './dtos/image';
import AuthService from './auth.service';
import AlbumsService from './albums.service';
import ImagesService from './images.service';
import UsersService from './users.service';
import { UserInfo } from './dtos/user';

export interface IAuthService {
    signIn(login: string, password: string): Promise<string>;
}

export interface IUsersService {
    getAll(id: string): Promise<UserInfo[]>
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
  users: IUsersService;
  almubs: IAlbumsService;
  images: IImagesService;
  constructor(deps: Deps) {
    this.auth = new AuthService(deps.repos.users, deps.authManager);
    this.users = new UsersService(deps.repos.users);
    this.almubs = new AlbumsService(deps.repos.albums);
    this.images = new ImagesService(deps.repos.images);
  }
}
