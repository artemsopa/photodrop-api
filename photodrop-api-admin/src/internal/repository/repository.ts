import { DataSource } from 'typeorm';
import User from './entities/user';
import Album from './entities/album';
import Image from './entities/image';
import UsersRepo from './users.repo';
import ImagesRepo from './images.repo';
import AlbumsRepo from './albums.repo';

export interface IUsersRepo {
  isLoginExists(login: string): Promise<boolean>
  isEmailExists(email: string): Promise<boolean>;
  getByLogin(login: string): Promise<User | null>;
  create(user: User): Promise<void>;
}

export interface IAlbumsRepo {
  getAll(userId: string): Promise<Album[]>;
  isAlbumExists(userId: string, title: string): Promise<boolean>;
  create(album: Album): Promise<void>;
}

export interface IImagesRepo {
  getAllByAlbumId(albumId: string): Promise<Image[]>;
  create(image: Image): Promise<void>;

  // isImageExists(PK: string, title: string): Promise<boolean>;
  // getAll(PK: string): Promise<Image[]>;
  // getImage(PK: string, title: string): Promise<Image | undefined>;
  // create(PK: string, image: Image): Promise<void>;
  // delete(PK: string, title: string): Promise<void>;
}

export default class Repositories {
  users: IUsersRepo;
  albums: IAlbumsRepo;
  images: IImagesRepo;
  constructor(ds: DataSource) {
    this.users = new UsersRepo(ds);
    this.albums = new AlbumsRepo(ds);
    this.images = new ImagesRepo(ds);
  }
}
