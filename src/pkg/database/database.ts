import 'reflect-metadata';
import { DataSource } from 'typeorm';
import Phgraph from '../../internal/repositories/entities/phgraph';
import Album from '../../internal/repositories/entities/album';
import Photo from '../../internal/repositories/entities/photo';
import User from '../../internal/repositories/entities/user';
import Order from '../../internal/repositories/entities/order';

const initDbConnection = async (
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
    entities: [Phgraph, Album, Photo, User, Order],
    synchronize: false,
    logging: true,
  });
  await appDataSource.initialize();
  console.log('Database connection successful...');
  return appDataSource;
};

export default initDbConnection;
