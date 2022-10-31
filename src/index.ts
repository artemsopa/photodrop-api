import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { initConfigs } from '@/utils/configs';
import { Photographer } from '@/entities/Photographer';
import { Album } from '@/entities/Album';
import { Photo } from '@/entities/Photo';
import { Order } from '@/entities/Order';
import { User } from '@/entities/User';
import { Bucket } from '@/utils/Bucket';
import { Queue } from '@/utils/Queue';
import { Otp } from '@/utils/Otp';
import { Jwt } from '@/utils/Jwt';
import { AuthService } from '@/services/AuthService';
import { AlbumService } from '@/services/AlbumService';
import { PhotoService } from '@/services/PhotoService';
import { OrderService } from '@/services/OrderService';
import { OtpService } from '@/services/OtpService';
import { ProfileService } from '@/services/ProfileService';
import { GalleryService } from '@/services/GalleryService';
import { AuthHandler } from '@/handlers/AuthHandler';
import { AlbumHandler } from '@/handlers/AlbumHandler';
import { PhotoHandler } from '@/handlers/PhotoHandler';
import { OrderHandler } from '@/handlers/OrderHandler';
import { OtpHandler } from '@/handlers/OtpHandler';
import { ProfileHandler } from '@/handlers/ProfileHandler';
import { GalleryHandler } from '@/handlers/GaleryHandler';
import { EventService } from './services/EventService';
import { EventHandler } from './handlers/EventHandler';

const configs = initConfigs();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = configs.db;
const ds = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [Photographer, Album, Photo, User, Order],
  synchronize: false,
  logging: false,
});

const { JWT_SIGNING_KEY, JWT_TTL } = configs.jwt;
const jwt = new Jwt(JWT_SIGNING_KEY, JWT_TTL);

const { TWILIO_SID, TWILIO_TOKEN, TWILIO_VERIFY_SERVICE, TWILIO_NOTIFY_SERVICE } = configs.twilio;
const otp = new Otp(TWILIO_SID, TWILIO_TOKEN, TWILIO_VERIFY_SERVICE, TWILIO_NOTIFY_SERVICE);

const { S3_BUCKET } = configs.s3;
const bucket = new Bucket(S3_BUCKET);

const { SQS_URL } = configs.sqs;
const queue = new Queue(SQS_URL);

const authService = new AuthService(ds, jwt);
const albumService = new AlbumService(ds);
const photoService = new PhotoService(ds, bucket);
const orderService = new OrderService(ds, queue);
const otpService = new OtpService(ds, jwt, otp);
const profileService = new ProfileService(ds, otp, bucket);
const galleryService = new GalleryService(ds, bucket);
const eventService = new EventService(bucket, configs.dir, ds, otp);

const handlers = {
  ...new AuthHandler(authService),
  ...new AlbumHandler(albumService, jwt),
  ...new PhotoHandler(photoService, jwt),
  ...new OrderHandler(orderService, jwt),
  ...new OtpHandler(otpService),
  ...new ProfileHandler(profileService, jwt),
  ...new GalleryHandler(galleryService, jwt),
  ...new EventHandler(eventService, queue),
};

export const {
  login,
  getAllAlbums,
  createAlbum,
  getUsersAndPhotosByAlbum,
  getPhotoUploadUrl,
  createPhotos,
  createOrder,
  sendVerificationCode,
  verifyUser,
  getProfile,
  sendProfileVerificationCode,
  updatePhone,
  updateEmail,
  updateFullName,
  updateAvatar,
  getAvatarUploadUrl,
  getGalleryByUser,
  getAllPhotosByGalleryAlbum,
  payForGalleryAlbum,
  notify,
  resize,
} = handlers;
