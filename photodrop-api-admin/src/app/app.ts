import initConfigs from '../configs/config';
import Repositories from '../internal/repository/repository';
import Services, { Deps } from '../internal/service/service';
import { BcryptHasher } from '../pkg/hasher/password';
import { JwtManager } from '../pkg/auth/jwt';
import initDB from '../pkg/database/database';
import Handler from '../internal/delivery/handler';

export const runApp = () => {
  const configs = initConfigs();

  const ds = initDB(configs.db.DB_HOST, configs.db.DB_PORT, configs.db.DB_USER, configs.db.DB_PASSWORD, configs.db.DB_NAME);
  const hasher = new BcryptHasher(configs.hasher.HASHER_SALT);
  const jwtManager = new JwtManager(configs.jwt.JWT_SIGNING_KEY, configs.jwt.JWT_TTL);
  const deps = new Deps(
    new Repositories(ds),
    hasher,
    jwtManager,
  );
  const services = new Services(deps);
  const handler = new Handler(services, jwtManager);

  return handler.initHandler();
};
