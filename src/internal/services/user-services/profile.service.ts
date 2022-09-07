import { IProfileService } from '../services';
import { IUsersRepo } from '../../repositories/repositories';
import { IOTP } from '../../../pkg/otp/twilio';
import { IS3Storage } from '../../../pkg/storage/s3';

class ProfileService implements IProfileService {
  constructor(private usersRepo: IUsersRepo, private otp: IOTP, private s3Storage: IS3Storage) {
    this.usersRepo = usersRepo;
    this.otp = otp;
    this.s3Storage = s3Storage;
  }

  async updatePhone(id: string, phone: string): Promise<void> {
    await this.usersRepo.updatePhone(id, phone);
  }

  async updateEmail(id: string, email: string): Promise<void> {
    await this.usersRepo.updateEmail(id, email);
  }

  async updateFullName(id: string, fullName: string): Promise<void> {
    await this.usersRepo.updateFullName(id, fullName);
  }

  async updateAvatar(id: string, avatar: string): Promise<void> {
    /// TODO: Upload to S3
    await this.usersRepo.updateAvatar(id, avatar);
  }
}

export default ProfileService;
