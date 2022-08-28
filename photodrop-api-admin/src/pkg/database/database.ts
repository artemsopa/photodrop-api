import { DataSource } from 'typeorm';
import User from '../../internal/repository/entities/user';
import Album from '../../internal/repository/entities/album';
import Image from '../../internal/repository/entities/image';

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
    // entities: [User, Album, Image],
    synchronize: false,
    logging: true,
  });
  appDataSource.initialize();
  console.log('Database connection successful...');
  return appDataSource;
};

export default initDB;
