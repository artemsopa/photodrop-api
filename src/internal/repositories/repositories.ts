import { DataSource } from 'typeorm';
import Phgraph from './entities/phgraph';
import Album from './entities/album';
import Photo from './entities/photo';
import PhgraphsRepo from './phgraphs.repo';
import AlbumsRepo from './albums.repo';
import PhotosRepo from './photos.repo';
import User from './entities/user';
import UsersRepo from './users.repo';

export interface IPhgraphsRepo {
  findByLogin(login: string): Promise<Phgraph | null>;
}

export interface IAlbumsRepo {
  findAll(phgraphId: string): Promise<Album[]>;
  isAlbumExists(phgraphId: string, title: string): Promise<boolean>;
  create(album: Album): Promise<void>;
}

export interface IUsersRepo {
  findAll(): Promise<User[]>;
  findOneByPhone(phone: string): Promise<User | null>
  create(user: User): Promise<User>;
  updatePhone(id: string, phone: string): Promise<void>;
  updateEmail(id: string, email: string): Promise<void>;
  updateFullName(id: string, fullName: string): Promise<void>;
  updateAvatar(id: string, avatar: string): Promise<void>;
}

export interface IPhotosRepo {
  findAlbumsByUser(userId: string): Promise<Album[]>;
  findAllByUser(userId: string): Promise<Photo[]>;
  findAllByAlbum(userId: string, albumId: string): Promise<Photo[]>;
  createMany(photos: Photo[]): Promise<void>;
  updateIsPaidByAlbum(userId: string, albumId: string): Promise<void>
}

export default class Repositories {
  phgraphs: IPhgraphsRepo;
  users: IUsersRepo;
  albums: IAlbumsRepo;
  photos: IPhotosRepo;
  constructor(ds: DataSource) {
    this.phgraphs = new PhgraphsRepo(ds);
    this.users = new UsersRepo(ds);
    this.albums = new AlbumsRepo(ds);
    this.photos = new PhotosRepo(ds);
  }
}
