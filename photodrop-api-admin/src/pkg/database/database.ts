import 'reflect-metadata';
import { DataSource } from 'typeorm';
import User from '../../internal/repository/entities/user';
import Album from '../../internal/repository/entities/album';
import Photo from '../../internal/repository/entities/photo';
import UserAlbum from '../../internal/repository/entities/user_album';
import Camerist from '../../internal/repository/entities/camerist';
import OrderPhoto from '../../internal/repository/entities/order_photo';

const initDB = (
  host: string,
  port: number,
  username: string,
  password: string,
  database: string,
) => {
  const appDataSource = new DataSource({
    type: 'mysql',
    host,
    port,
    username,
    password,
    database,
    entities: [Camerist, User, Album, Photo, UserAlbum, OrderPhoto],
    synchronize: true,
    logging: true,
  });
  appDataSource.initialize();
  console.log('Database connection successful...');
  return appDataSource;
};

export default initDB;
