import 'reflect-metadata';
import { DataSource } from 'typeorm';
import User from '../../internal/repository/entities/user';
import Album from '../../internal/repository/entities/album';
import Photo from '../../internal/repository/entities/photo';
import Camerist from '../../internal/repository/entities/camerist';
import Order from '../../internal/repository/entities/order';

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
    entities: [Camerist, User, Album, Photo, Order],
    synchronize: false,
    logging: true,
  });
  appDataSource.initialize();
  console.log('Database connection successful...');
  return appDataSource;
};

export default initDB;
