import dotenv from 'dotenv';

const initConfigs = () => {
  dotenv.config();
  const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    HASHER_SALT,
    JWT_SIGNING_KEY,
    JWT_TTL,
  } = process.env;

  if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME || !HASHER_SALT || !JWT_SIGNING_KEY || !JWT_TTL) {
    throw new Error('ERROR! Invalid configuration');
  }

  return {
    db: {
      DB_HOST, DB_PORT: Number(DB_PORT), DB_USER, DB_PASSWORD, DB_NAME,
    },
    hasher: {
      HASHER_SALT: Number(HASHER_SALT),
    },
    jwt: {
      JWT_SIGNING_KEY,
      JWT_TTL,
    },
  };
};

export default initConfigs;
