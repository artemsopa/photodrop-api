import dotenv from 'dotenv';

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
  } = process.env;

  if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME || !JWT_SIGNING_KEY || !JWT_TTL || !S3_REGION || !S3_BUCKET) {
    throw new Error('ERROR! Invalid configuration');
  }

  return {
    db: {
      DB_HOST, DB_PORT: Number(DB_PORT), DB_USER, DB_PASSWORD, DB_NAME,
    },
    s3: {
      S3_REGION,
      S3_BUCKET,
    },
    jwt: {
      JWT_SIGNING_KEY,
      JWT_TTL,
    },
  };
};

export default initConfigs;
