import { UserInfo } from '../dtos/user';
import { IUsersService } from '../services';
import { IUsersRepo } from '../../repositories/repositories';
import { IS3Storage } from '../../../pkg/storage/s3';

class UsersService implements IUsersService {
  constructor(private usersRepo: IUsersRepo, private s3Storage: IS3Storage) {
    this.usersRepo = usersRepo;
    this.s3Storage = s3Storage;
  }

  async getAll(): Promise<UserInfo[]> {
    return Promise.all((await this.usersRepo.findAll()).map(async (item) => new UserInfo(
      item.id,
      item.phone,
      item.fullName,
      item.email,
      item.avatar ? await this.s3Storage.getSignedUrlGet(item.avatar) : null,
    )));
  }
}

export default UsersService;
