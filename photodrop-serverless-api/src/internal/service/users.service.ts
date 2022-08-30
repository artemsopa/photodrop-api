import { UserInfo } from './dtos/user';
import { IUsersService } from './service';
import { IUsersRepo } from '../repository/repository';

class UsersService implements IUsersService {
  constructor(private usersRepo: IUsersRepo) {
    this.usersRepo = usersRepo;
  }

  async getAll(id: string): Promise<UserInfo[]> {
    return (await this.usersRepo.getAll(id)).map((item) => new UserInfo(
      item.id,
      item.login,
      item.fullName,
    ));
  }
}

export default UsersService;
