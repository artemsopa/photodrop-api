import dotenv from 'dotenv';

class DbConfigs {
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  constructor(DB_HOST: string, DB_PORT: number, DB_USER: string, DB_PASSWORD: string, DB_NAME: string) {
    this.DB_HOST = DB_HOST;
    this.DB_PORT = DB_PORT;
    this.DB_USER = DB_USER;
    this.DB_PASSWORD = DB_PASSWORD;
    this.DB_NAME = DB_NAME;
  }
}

class S3Configs {
  S3_REGION: string;
  S3_BUCKET: string;
  constructor(S3_REGION: string, S3_BUCKET: string) {
    this.S3_REGION = S3_REGION;
    this.S3_BUCKET = S3_BUCKET;
  }
}

class JwtConfigs {
  JWT_SIGNING_KEY: string;
  JWT_TTL: string;
  constructor(JWT_SIGNING_KEY: string, JWT_TTL: string) {
    this.JWT_SIGNING_KEY = JWT_SIGNING_KEY;
    this.JWT_TTL = JWT_TTL;
  }
}

class OtpConfigs {
  TWILIO_SID: string;
  TWILIO_TOKEN: string;
  TWILIO_SERVICE: string;
  constructor(TWILIO_SID: string, TWILIO_TOKEN: string, TWILIO_SERVICE: string) {
    this.TWILIO_SID = TWILIO_SID;
    this.TWILIO_TOKEN = TWILIO_TOKEN;
    this.TWILIO_SERVICE = TWILIO_SERVICE;
  }
}

export class Configs {
  db: DbConfigs;
  s3: S3Configs;
  jwt: JwtConfigs;
  otp: OtpConfigs;
  constructor(db: DbConfigs, s3: S3Configs, jwt: JwtConfigs, otp: OtpConfigs) {
    this.db = db;
    this.s3 = s3;
    this.jwt = jwt;
    this.otp = otp;
  }
}

const initConfigs = () => {
  dotenv.config();
  const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    JWT_SIGNING_KEY,
    JWT_TTL,
    S3_REGION,
    S3_BUCKET,
    TWILIO_SID,
    TWILIO_TOKEN,
    TWILIO_SERVICE,
  } = process.env;

  if (!DB_HOST
    || !DB_PORT
    || !DB_USER
    || !DB_PASSWORD
    || !DB_NAME
    || !JWT_SIGNING_KEY
    || !JWT_TTL
    || !S3_REGION
    || !S3_BUCKET
    || !TWILIO_SID
    || !TWILIO_TOKEN
    || !TWILIO_SERVICE) {
    throw new Error('ERROR! Invalid configuration');
  }

  return new Configs(
    new DbConfigs(DB_HOST, Number(DB_PORT), DB_USER, DB_PASSWORD, DB_NAME),
    new S3Configs(S3_REGION, S3_BUCKET),
    new JwtConfigs(JWT_SIGNING_KEY, JWT_TTL),
    new OtpConfigs(TWILIO_SID, TWILIO_TOKEN, TWILIO_SERVICE),
  );
};

export default initConfigs;
