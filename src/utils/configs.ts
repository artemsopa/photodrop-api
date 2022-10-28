import dotenv from 'dotenv';

export const initConfigs = () => {
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

  return {
    db: {
      DB_HOST,
      DB_PORT: Number(DB_PORT),
      DB_USER,
      DB_PASSWORD,
      DB_NAME,
    },
    jwt: {
      JWT_SIGNING_KEY,
      JWT_TTL,
    },
    s3: {
      S3_REGION,
      S3_BUCKET,
    },
    twilio: {
      TWILIO_SID,
      TWILIO_TOKEN,
      TWILIO_SERVICE,
    },
  };
};
