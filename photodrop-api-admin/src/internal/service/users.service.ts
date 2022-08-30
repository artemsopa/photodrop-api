import { UserInfo } from './dtos/user';
import { IUsersService } from './service';
import { IUsersRepo } from '../repository/repository';

class UsersService implements IUsersService {
  constructor(private usersRepo: IUsersRepo) {
    this.usersRepo = usersRepo;
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
}

export default UsersService;
