import { DataSource } from 'typeorm';
import initConfigs, { Configs } from '../configs/config';
import Repositories from '../internal/repository/repository';
import Services, { Deps } from '../internal/service/service';
import Handler from '../internal/delivery/handler';
import initDbConnection from '../pkg/database/database';
import { JwtManager } from '../pkg/auth/jwt.auth';
import { S3Storage } from '../pkg/storage/s3';
import { ClientOTP } from '../pkg/otp/twilio';

const configs = initConfigs();
const dataSource = initDbConnection(
  configs.db.DB_HOST,
  configs.db.DB_PORT,
  configs.db.DB_USER,
  configs.db.DB_PASSWORD,
  configs.db.DB_NAME,
);

const createApp = async (dsPromise: Promise<DataSource>, cfgs: Configs) => {
  const ds = await dsPromise;
  const jwtManager = new JwtManager(cfgs.jwt.JWT_SIGNING_KEY, cfgs.jwt.JWT_TTL);
  const s3 = new S3Storage(cfgs.s3.S3_REGION, cfgs.s3.S3_BUCKET);
  const otp = new ClientOTP(cfgs.otp.TWILIO_SID, cfgs.otp.TWILIO_TOKEN, cfgs.otp.TWILIO_SERVICE);
  const deps = new Deps(
    new Repositories(ds),
    jwtManager,
    s3,
    otp,
  );
  const services = new Services(deps);
  const handler = new Handler(services, jwtManager);
  const app = handler.initHandler();

  return app;
};

export default createApp(dataSource, configs);
