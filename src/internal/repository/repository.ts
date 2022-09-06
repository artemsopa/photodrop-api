import { DataSource } from 'typeorm';
import Camerist from './entities/camerist';
import Album from './entities/album';
import Photo from './entities/photo';
import CameristsRepo from './camerists.repo';
import AlbumsRepo from './albums.repo';
import PhotosRepo from './photos.repo';
import User from './entities/user';
import UsersRepo from './users.repo';
import OrdersRepo from './orders.repo';

export interface ICameristsRepo {
  getByLogin(login: string): Promise<Camerist | null>;
}

export interface IUsersRepo {
  getAll(): Promise<User[]>;
  findOneByPhone(phone: string): Promise<User | null>
  create(user: User): Promise<User>;
  updatePhone(id: string, phone: string): Promise<void>;
  updateEmail(id: string, email: string): Promise<void>;
  updateFullName(id: string, fullName: string): Promise<void>;
  updateAvatar(id: string, avatar: string): Promise<void>;
}

export interface IAlbumsRepo {
  getAll(cameristId: string): Promise<Album[]>;
  isAlbumExists(cameristId: string, title: string): Promise<boolean>;
  create(album: Album): Promise<void>;
}

export interface IPhotosRepo {
  getAllByAlbum(albumId: string, cameristId: string): Promise<Photo[]>;
  createMany(photos: Photo[]): Promise<void>;
}

export interface IOrdersRepo {
  createMany(orders: Order[]): Promise<void>;
  getOrderAlbumsByUser(userId: string): Promise<Album[]>;
  getOrderPhotosByUser(userId: string): Promise<Order[]>;
  getOrderPhotosByAlbumUser(userId: string, albumId: string): Promise<Order[]>;
}

export default class Repositories {
  camerists: ICameristsRepo;
  users: IUsersRepo;
  albums: IAlbumsRepo;
  photos: IPhotosRepo;
  orders: IOrdersRepo;
  constructor(ds: DataSource) {
    this.camerists = new CameristsRepo(ds);
    this.users = new UsersRepo(ds);
    this.albums = new AlbumsRepo(ds);
    this.photos = new PhotosRepo(ds);
    this.orders = new OrdersRepo(ds);
  }
}
