import initConfigs, { Configs } from '../configs/config';
import Repositories from '../internal/repositories/repositories';
import Services, { Deps } from '../internal/services/services';
import Handler from '../internal/delivery/handler';
import initDbConnection from '../pkg/database/database';
import TwilioOTP from '../pkg/otp/twilio.otp';
import { JwtManager } from '../pkg/auth/jwt.auth';
import { S3Storage } from '../pkg/storage/s3';

const createApp = async () => {
  const cfgs = initConfigs();
  const ds = initDbConnection(cfgs.db.DB_HOST, cfgs.db.DB_PORT, cfgs.db.DB_USER, cfgs.db.DB_PASSWORD, cfgs.db.DB_NAME);

  const jwtManager = new JwtManager(cfgs.jwt.JWT_SIGNING_KEY, cfgs.jwt.JWT_TTL);
  const s3 = new S3Storage(cfgs.s3.S3_REGION, cfgs.s3.S3_BUCKET);
  const otp = new TwilioOTP(cfgs.otp.TWILIO_SID, cfgs.otp.TWILIO_TOKEN, cfgs.otp.TWILIO_SERVICE);

  const deps = new Deps(new Repositories(await ds), jwtManager, s3, otp);
  const services = new Services(deps);
  const handler = new Handler(services, jwtManager);

  const app = handler.initHandler();
  return app;
};

export default createApp();
