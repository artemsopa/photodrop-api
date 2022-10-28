import { DataSource, Not } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { extension } from 'mime-types';
import { Otp } from '@/utils/Otp';
import { Bucket } from '@/utils/Bucket';
import { User } from '@/entities/User';
import { Profile } from '@/dtos/user';
import { ApiError } from '@/utils/ApiError';

export class ProfileService {
  constructor(private readonly ds: DataSource, private readonly otp: Otp, private readonly bucket: Bucket) {
    this.ds = ds;
    this.otp = otp;
    this.bucket = bucket;
  }

  public getByUser = async (id: string) => {
    if (!this.ds.manager.connection.isInitialized) await this.ds.initialize();

    const user = await this.ds.getRepository(User).findOneBy({ id });
    if (!user) throw ApiError.unauthorized('Cannot find user profile');
    if (user.avatar) user.avatar = await this.bucket.getSignedUrlGetObject(user.avatar);
    return new Profile(user.phone, user.fullName, user.email, user.avatar);
  };

  public sendVerificationCode = async (id: string, phone: string) => {
    if (!this.ds.manager.connection.isInitialized) await this.ds.initialize();

    const user = await this.ds.getRepository(User).findOne({ where: { id: Not(id), phone } });
    if (!user) throw ApiError.badRequest('Phone already in use');
    await this.otp.sendCode(phone);
  };

  public updatePhone = async (id: string, phone: string, code: string) => {
    if (!this.ds.manager.connection.isInitialized) await this.ds.initialize();

    const user = await this.ds.getRepository(User).findOne({ where: { id: Not(id), phone } });
    if (!user) throw ApiError.badRequest('Phone already in use');
    await this.otp.verifyNumber(phone, code);
    await this.ds.getRepository(User).update({ id }, { phone });
  };

  public updateEmail = async (id: string, email: string) => {
    if (!this.ds.manager.connection.isInitialized) await this.ds.initialize();

    const user = await this.ds.getRepository(User).findOne({ where: { id: Not(id), email } });
    if (!user) throw ApiError.badRequest('Email already in use');
    await this.ds.getRepository(User).update({ id }, { email });
  };

  public updateFullName = async (id: string, fullName: string) => {
    if (!this.ds.manager.connection.isInitialized) await this.ds.initialize();

    const user = await this.ds.getRepository(User).findOne({ where: { id: Not(id), fullName } });
    if (!user) throw ApiError.badRequest('Full name already in use');
    await this.ds.getRepository(User).update({ id }, { fullName });
  };

  public getAvatarUploadUrl = async (id: string, contentType: string) => {
    if (!this.ds.manager.connection.isInitialized) await this.ds.initialize();

    await this.bucket.isImageConentType(contentType);
    const user = await this.ds.getRepository(User).findOneBy({ id });
    if (!user) throw ApiError.unauthorized('Cannot find user profile');
    if (!user.avatar) user.avatar = `avatars/${id}/${uuidv4()}.${extension(contentType)}`;
    const url = await this.bucket.getSignedUrlPutObject(user.avatar, contentType);
    return {
      data: {
        method: 'PUT',
        url,
        fields: [],
        headers: { 'Content-Type': contentType },
      },
      key: user.avatar,
    };
  };

  public updateAvatar = async (id: string, avatar: string) => {
    if (!this.ds.manager.connection.isInitialized) await this.ds.initialize();

    const user = await this.ds.getRepository(User).findOneBy({ id });
    if (!user) throw ApiError.unauthorized('Cannot find user profile');
    if (!user.avatar) await this.ds.getRepository(User).update({ id }, { avatar });
  };
}
