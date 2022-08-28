import { AuthManager } from '../../pkg/auth/jwt';
import { Hasher } from '../../pkg/hasher/password';
import Repositories from '../repository/repository';
import { AlbumInfo, AlbumInput } from './dtos/album';
import { ImageInput, ImageInfo } from './dtos/image';
import { UserInfo, UserInput } from './dtos/user';
import AuthService from './auth.service';
import AlbumsService from './albums.service';
import ImagesService from './images.service';
import UsersService from './users.service';

export interface IAuthService {
    signUp(user: UserInput): Promise<void>;
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

export interface IUsersService {
  getAll(): Promise<UserInfo[]>
}

export class Deps {
  repos: Repositories;
  hasher: Hasher;
  authManager: AuthManager;
  constructor(repos: Repositories, hasher: Hasher, authManager: AuthManager) {
    this.repos = repos;
    this.hasher = hasher;
    this.authManager = authManager;
  }
}

export default class Services {
  auth: IAuthService;
  almubs: IAlbumsService;
  images: IImagesService;
  users: IUsersService;
  constructor(deps: Deps) {
    this.auth = new AuthService(deps.repos.users, deps.hasher, deps.authManager);
    this.almubs = new AlbumsService(deps.repos.albums);
    this.images = new ImagesService(deps.repos.images);
    this.users = new UsersService(deps.repos.users);
  }
}
