import { IAuthManager } from '../../pkg/auth/auth';
import { AlbumInfo, AlbumInput } from './dtos/album';
import { PhotoInfo, PhotoInput } from './dtos/photo';
import { UserInfo } from './dtos/user';
import { IS3Storage } from '../../pkg/storage/s3';
import { IOTP } from '../../pkg/otp/twilio';
import Repositories from '../repositories/repositories';
import AuthPhgraphsService from './phgraphs-services/auth.service';
import UsersService from './phgraphs-services/users.service';
import AlbumsService from './phgraphs-services/albums.service';
import PhotosService from './phgraphs-services/photos.service';
import AuthUsersService from './user-services/auth.service';
import ProfileService from './user-services/profile.service';
import GalleryService from './user-services/gallery.service';

// Photograpgs Services
export interface IAuthPhgraphsService {
  signIn(login: string, password: string): Promise<string>;
}

export interface IUsersService {
  getAll(): Promise<UserInfo[]>;
}

export interface IAlbumsService {
  getAll(phgraphId: string): Promise<AlbumInfo[]>;
  create(phgraphId: string, album: AlbumInput): Promise<void>;
}

export interface IPhotosService {
  getUploadUrl(phgraphId: string, albumId: string, contentType: string): Promise<any>;
  createMany(phgraphId: string, albumId: string, photosInp: PhotoInput[]): Promise<void>;
}

// Users Services
export interface IAuthUsersService {
  sendVerificationCode(phone: string): Promise<void>;
  verifyUser(phone: string, code: string): Promise<string>;
}

export interface IProfileService {
  updatePhone(id: string, phone: string): Promise<void>;
  updateEmail(id: string, email: string): Promise<void>;
  updateFullName(id: string, fullName: string): Promise<void>;
  updateAvatar(id: string, avatar: string): Promise<void>;
}

export interface IGalleryService {
  getAllByUser(userId: string): Promise<{ albums: AlbumInfo[], photos: PhotoInfo[]; }>;
  getAllPhotosByAlbum(userId: string, albumId: string): Promise<PhotoInfo[]>;
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
  users: IUsersService;
  almubs: IAlbumsService;
  photos: IPhotosService;

  authUsers: IAuthUsersService;
  profile: IProfileService;
  gallery: IGalleryService;

  constructor(deps: Deps) {
    this.authPhgrapgs = new AuthPhgraphsService(deps.repos.phgraphs, deps.authManager);
    this.users = new UsersService(deps.repos.users);
    this.almubs = new AlbumsService(deps.repos.albums);
    this.photos = new PhotosService(deps.repos.photos, deps.s3Storage);

    this.authUsers = new AuthUsersService(deps.repos.users, deps.authManager, deps.otp);
    this.profile = new ProfileService(deps.repos.users, deps.otp, deps.s3Storage);
    this.gallery = new GalleryService(deps.repos.photos, deps.s3Storage);
  }
}
