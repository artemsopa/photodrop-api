import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { IProfileService } from '../services';
import { IUsersRepo } from '../../repositories/repositories';
import { IOTP } from '../../../pkg/otp/otp';
import { IS3Storage } from '../../../pkg/storage/s3';
import { Profile } from '../dtos/user';
import ApiError from '../../../pkg/error/api.error';

class ProfileService implements IProfileService {
  constructor(private usersRepo: IUsersRepo, private otp: IOTP, private s3Storage: IS3Storage) {
    this.usersRepo = usersRepo;
    this.otp = otp;
    this.s3Storage = s3Storage;
  }

  async getByUser(id: string): Promise<Profile> {
    const user = await this.usersRepo.findOne(id);
    if (!user) throw new ApiError(401, 'Unauthorized! Cannot find user profile.');
    if (user.avatar) user.avatar = await this.s3Storage.getSignedUrlGet(user.avatar);
    return new Profile(user.phone, user.fullName, user.email, user.avatar);
  }

  async updatePhone(id: string, phone: string, code: string): Promise<void> {
    await this.otp.verifyNumber(phone, code);
    await this.usersRepo.updatePhone(id, phone);
  }

  async updateEmail(id: string, email: string): Promise<void> {
    await this.usersRepo.updateEmail(id, email);
  }

  async updateFullName(id: string, fullName: string): Promise<void> {
    await this.usersRepo.updateFullName(id, fullName);
  }

  async getUploadAvatarUrl(id: string, contentType: string) {
    await this.s3Storage.isImageType(contentType);
    const user = await this.usersRepo.findOne(id);
    if (!user) throw new ApiError(401, 'Unauthorized! Cannot find user profile.');
    if (!user.avatar) user.avatar = `avatars/${id}/${uuidv4()}.${mime.extension(contentType)}`;
    const url = await this.s3Storage.getSignedUrlPut(user.avatar, contentType);
    return {
      data: {
        method: 'PUT', url, fields: [], headers: { 'Content-Type': contentType },
      },
      key: user.avatar,
    };
  }

  async updateAvatar(id: string, key: string): Promise<void> {
    const user = await this.usersRepo.findOne(id);
    if (!user) throw new ApiError(401, 'Unauthorized! Cannot find user profile.');
    if (!user.avatar) await this.usersRepo.updateAvatar(id, key);
  }
}

export default ProfileService;
