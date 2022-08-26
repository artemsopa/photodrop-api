import { DataSource } from 'typeorm';

const initDB = async (
  host: string,
  port: number,
  username: string,
  password: string,
) => {
  const appDataSource = new DataSource({
    type: 'mysql',
    host,
    port,
    username,
    password,
    // entities: [Info, Favourite],
    synchronize: true,
    logging: true,
  });
  await appDataSource.initialize();
  console.log('Database connection successful...');
  return appDataSource;
};

export default initDB;
