import { IUsersRepo } from '../repository/repository';
import { UserInfo } from './dtos/user';
import { IUsersService } from './service';

class UsersService implements IUsersService {
  constructor(private usersRepo: IUsersRepo) {
    this.usersRepo = usersRepo;
  }

  async getAll(): Promise<UserInfo[]> {
    return (await this.usersRepo.getAll()).map((item) => new UserInfo(item.id, item.login, item.fullName, item.email));
  }
}

export default UsersService;
