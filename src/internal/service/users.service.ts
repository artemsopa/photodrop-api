import { UserInfo } from './dtos/user';
import { IUsersService } from './service';
import { IUsersRepo } from '../repository/repository';
import { IOTP } from '../../pkg/otp/twilio';

class UsersService implements IUsersService {
  constructor(private usersRepo: IUsersRepo, private otp: IOTP) {
    this.usersRepo = usersRepo;
    this.otp = otp;
  }

  async getAll(): Promise<UserInfo[]> {
    return (await this.usersRepo.getAll()).map((item) => new UserInfo(
      item.id,
      item.phone,
      item.fullName,
      item.email,
      item.avatar,
    ));
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

export default UsersService;
