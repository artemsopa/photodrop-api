import { DataSource, Repository } from 'typeorm';
import { IUsersRepo } from './repository';
import User from './entities/user';

class UsersRepo implements IUsersRepo {
  private repo: Repository<User>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(User);
  }

  async isLoginExists(login: string): Promise<boolean> {
    const user = await this.repo.findOne({
      where: {
        login,
      },
    });
    return !!user;
  }

  async isEmailExists(email: string): Promise<boolean> {
    const user = await this.repo.findOne({
      where: {
        email,
      },
    });
    return !!user;
  }

  async getByLogin(login: string): Promise<User | null> {
    const user = await this.repo.findOne({
      where: {
        login,
      },
    });
    return user;
  }

  async create(user: User): Promise<void> {
    await this.repo.save(user);
  }
}

export default UsersRepo;
