import { IAuthManager } from '../../pkg/auth/auth';
import Repositories from '../repository/repository';
import { AlbumInfo, AlbumInput } from './dtos/album';
import { PhotoInfo } from './dtos/photo';
import AuthService from './auth.service';
import AlbumsService from './albums.service';
import UsersService from './users.service';
import { UserInfo } from './dtos/user';
import { IS3Storage } from '../../pkg/storage/s3';
import PhotosService from './photos.service';
import { OrderInput } from './dtos/order';
import OrdersService from './orders.service';

export interface IAuthService {
    signIn(login: string, password: string): Promise<string>;
}

export interface IUsersService {
    getAll(): Promise<UserInfo[]>
}

export interface IAlbumsService {
    getAll(cameristId: string): Promise<AlbumInfo[]>;
    create(cameristId: string, album: AlbumInput): Promise<void>;
}

export interface IPhotosService {
    createUploadUrl(cameristId: string, albumId: string, contentType: string): Promise<{ data: { method: string, url: string, fields: string[], headers: string[] }, key: string }>
    createMany(cameristId: string, albumId: string, keys: string[]): Promise<void>;
    getAllByAlbum(cameristId: string, albumId: string): Promise<PhotoInfo[]>;
}

export interface IOrdersService {
    createOrder(cameristId: string, albumId: string, ordersInp: OrderInput[]): Promise<void>
}

export class Deps {
  repos: Repositories;
  authManager: IAuthManager;
  s3Storage: IS3Storage;
  constructor(repos: Repositories, authManager: IAuthManager, s3Storage: IS3Storage) {
    this.repos = repos;
    this.authManager = authManager;
    this.s3Storage = s3Storage;
  }
}

export default class Services {
  auth: IAuthService;
  users: IUsersService;
  almubs: IAlbumsService;
  photos: IPhotosService;
  orders: IOrdersService;
  constructor(deps: Deps) {
    this.auth = new AuthService(deps.repos.camerists, deps.authManager);
    this.users = new UsersService(deps.repos.users);
    this.almubs = new AlbumsService(deps.repos.albums);
    this.photos = new PhotosService(deps.repos.photos, deps.s3Storage);
    this.orders = new OrdersService(deps.repos.orders);
  }
}
