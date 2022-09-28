import { IAuthManager } from '../../pkg/auth/auth';
import {
  AlbumEmp, AlbumInfo, AlbumInput, AlbumWithPhotos,
} from './dtos/album';
import { PhotoInfo, PhotoItem } from './dtos/photo';
import { Profile, UserInfo } from './dtos/user';
import { IS3Storage } from '../../pkg/storage/s3';
import { IOTP } from '../../pkg/otp/otp';
import Repositories from '../repositories/repositories';
import AuthPhgraphsService from './phgraph-services/auth.service';
import AlbumsService from './phgraph-services/albums.service';
import PhotosService from './phgraph-services/photos.service';
import AuthUsersService from './user-services/auth.service';
import ProfileService from './user-services/profile.service';
import GalleryService from './user-services/gallery.service';
import { OrderInput } from './dtos/order';
import OrdersService from './phgraph-services/orders.service';

// Photograpgs Services
export interface IAuthPhgraphsService {
  signIn(login: string, password: string): Promise<string>;
}

export interface IAlbumsService {
  getAll(phgraphId: string): Promise<AlbumEmp[]>;
  create(phgraphId: string, album: AlbumInput): Promise<void>;
}

export interface IPhotosService {
  getUsersAndPhotosByAlbum(phgraphId: string, albumId: string): Promise<{ photos: PhotoItem[], users: UserInfo[] }>
  getUploadUrl(phgraphId: string, albumId: string, contentType: string): Promise<any>;
  createMany(phgraphId: string, albumId: string, keys: string[]): Promise<void>;
}

export interface IOrdersService {
  createMany(phgraphId: string, albumId: string, ordersInp: OrderInput[]): Promise<void>;
}

// Users Services
export interface IAuthUsersService {
  sendVerificationCode(phone: string): Promise<void>;
  verifyUser(phone: string, code: string): Promise<string>;
}

export interface IProfileService {
  getByUser(id: string): Promise<Profile>;
  updatePhone(id: string, phone: string, code: string): Promise<void>;
  updateEmail(id: string, email: string): Promise<void>;
  updateFullName(id: string, fullName: string): Promise<void>;
  getUploadAvatarUrl(id: string, contentType: string): Promise<any>;
  updateAvatar(id: string, avatar: string): Promise<void>;
}

export interface IGalleryService {
  getAllByUser(userId: string): Promise<{ albums: AlbumInfo[], photos: PhotoInfo[]; }>;
  getAllPhotosByAlbum(userId: string, albumId: string): Promise<AlbumWithPhotos>;
  payForAlbum(userId: string, albumId: string): Promise<void>;
}

export class Deps {
  repos: Repositories;
  authManager: IAuthManager;
  s3Storage: IS3Storage;
  otp: IOTP;
  constructor(repos: Repositories, authManager: IAuthManager, s3Storage: IS3Storage, otp: IOTP) {
    this.repos = repos;
    this.authManager = authManager;
    this.s3Storage = s3Storage;
    this.otp = otp;
  }
}

export default class Services {
  authPhgrapgs: IAuthPhgraphsService;
  almubs: IAlbumsService;
  photos: IPhotosService;
  orders: IOrdersService;

  authUsers: IAuthUsersService;
  profile: IProfileService;
  gallery: IGalleryService;

  constructor(deps: Deps) {
    this.authPhgrapgs = new AuthPhgraphsService(deps.repos.phgraphs, deps.authManager);
    this.almubs = new AlbumsService(deps.repos.albums);
    this.photos = new PhotosService(deps.repos.photos, deps.repos.users, deps.s3Storage);
    this.orders = new OrdersService(deps.repos.orders);

    this.authUsers = new AuthUsersService(deps.repos.users, deps.authManager, deps.otp);
    this.profile = new ProfileService(deps.repos.users, deps.otp, deps.s3Storage);
    this.gallery = new GalleryService(deps.repos.orders, deps.s3Storage);
  }
}
