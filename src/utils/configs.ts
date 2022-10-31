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

    S3_BUCKET,

    TWILIO_SID,
    TWILIO_TOKEN,
    TWILIO_VERIFY_SERVICE,
    TWILIO_NOTIFY_SERVICE,

    SQS_URL,

    LAMBDA_TASK_ROOT,
  } = process.env;

  if (!DB_HOST
      || !DB_PORT
      || !DB_USER
      || !DB_PASSWORD
      || !DB_NAME

      || !JWT_SIGNING_KEY
      || !JWT_TTL

      || !S3_BUCKET

      || !TWILIO_SID
      || !TWILIO_TOKEN
      || !TWILIO_VERIFY_SERVICE
      || !TWILIO_NOTIFY_SERVICE

      || !SQS_URL
      || !LAMBDA_TASK_ROOT) {
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
      S3_BUCKET,
    },
    twilio: {
      TWILIO_SID,
      TWILIO_TOKEN,
      TWILIO_VERIFY_SERVICE,
      TWILIO_NOTIFY_SERVICE,
    },
    sqs: {
      SQS_URL,
    },
    dir: LAMBDA_TASK_ROOT,
  };
};
