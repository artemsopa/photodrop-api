import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { initConfigs } from '@/utils/configs';
import { Photographer } from '@/entities/Photographer';
import { Album } from '@/entities/Album';
import { Photo } from '@/entities/Photo';
import { Order } from '@/entities/Order';
import { User } from '@/entities/User';
import { Bucket } from '@/utils/Bucket';
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

const { TWILIO_SID, TWILIO_TOKEN, TWILIO_SERVICE } = configs.twilio;
const otp = new Otp(TWILIO_SERVICE, TWILIO_SID, TWILIO_TOKEN);

const { S3_REGION, S3_BUCKET } = configs.s3;
const bucket = new Bucket(S3_BUCKET, S3_REGION);

const authService = new AuthService(ds, jwt);
const albumService = new AlbumService(ds);
const photoService = new PhotoService(ds, bucket);
const orderService = new OrderService(ds);
const otpService = new OtpService(ds, jwt, otp);
const profileService = new ProfileService(ds, otp, bucket);
const galleryService = new GalleryService(ds, bucket);

const authHandler = new AuthHandler(authService);
const albumHandler = new AlbumHandler(albumService, jwt);
const photoHandler = new PhotoHandler(photoService, jwt);
const orderHandler = new OrderHandler(orderService, jwt);
const otpHandler = new OtpHandler(otpService);
const profileHandler = new ProfileHandler(profileService, jwt);
const galleryHandler = new GalleryHandler(galleryService, jwt);

export const {
  login,
} = authHandler;

export const {
  getAllAlbums,
  createAlbum,
} = albumHandler;

export const {
  getUsersAndPhotosByAlbum,
  getPhotoUploadUrl,
  createPhotos,
} = photoHandler;

export const {
  createOrder,
} = orderHandler;

export const {
  sendVerificationCode,
  verifyUser,
} = otpHandler;

export const {
  getProfile,
  sendProfileVerificationCode,
  updatePhone,
  updateEmail,
  updateFullName,
  updateAvatar,
  getAvatarUploadUrl,
} = profileHandler;

export const {
  getGalleryByUser,
  getAllPhotosByGalleryAlbum,
  payForGalleryAlbum,
} = galleryHandler;
