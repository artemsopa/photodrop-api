import 'reflect-metadata';
import { DataSource } from 'typeorm';
import User from '../../internal/repositories/entities/user';
import Album from '../../internal/repositories/entities/album';
import Photo from '../../internal/repositories/entities/photo';
import Camerist from '../../internal/repositories/entities/phgraph';

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
    entities: [Camerist, User, Album, Photo],
    synchronize: false,
    logging: true,
  });
  await appDataSource.initialize();
  console.log('Database connection successful...');
  return appDataSource;
};

export default initDbConnection;
