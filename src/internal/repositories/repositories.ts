import { DataSource } from 'typeorm';
import Phgraph from './entities/phgraph';
import Album from './entities/album';
import Photo from './entities/photo';
import PhgraphsRepo from './phgraphs.repo';
import AlbumsRepo from './albums.repo';
import PhotosRepo from './photos.repo';
import User from './entities/user';
import UsersRepo from './users.repo';
import Order from './entities/order';
import OrdersRepo from './orders.repo';

export interface IPhgraphsRepo {
  findByLogin(login: string): Promise<Phgraph | null>;
}

export interface IAlbumsRepo {
  findAll(phgraphId: string): Promise<Album[]>;
  isAlbumExists(phgraphId: string, title: string): Promise<boolean>;
  create(album: Album): Promise<void>;
}

export interface IPhotosRepo {
  findAll(phgraphId: string): Promise<Photo[]>;
  findAllByAlbum(phgraphId: string, albumId: string): Promise<Photo[]>;
  createMany(photos: Photo[]): Promise<void>;
}

export interface IUsersRepo {
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User | null>;
  findOneByPhone(phone: string): Promise<User | null>
  create(user: User): Promise<User>;
  updatePhone(id: string, phone: string): Promise<void>;
  updateEmail(id: string, email: string): Promise<void>;
  updateFullName(id: string, fullName: string): Promise<void>;
  updateAvatar(id: string, avatar: string): Promise<void>;
}

export interface IOrdersRepo {
  findAllAlbumsByUser(userId: string): Promise<Album[]>;
  findAllPhotosByUser(userId: string): Promise<Order[]>;
  findAllByAlbum(userId: string, albumId: string): Promise<Album | null>;
  createMany(orders: Order[]): Promise<void>;
  updateIsPaidByAlbum(userId: string, albumId: string): Promise<void>;
}

export default class Repositories {
  phgraphs: IPhgraphsRepo;
  users: IUsersRepo;
  albums: IAlbumsRepo;
  photos: IPhotosRepo;
  orders: IOrdersRepo;
  constructor(ds: DataSource) {
    this.phgraphs = new PhgraphsRepo(ds);
    this.users = new UsersRepo(ds);
    this.albums = new AlbumsRepo(ds);
    this.photos = new PhotosRepo(ds);
    this.orders = new OrdersRepo(ds);
  }
}
