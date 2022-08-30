import { DataSource, Repository, Not } from 'typeorm';
import { IUsersRepo } from './repository';
import User from './entities/user';

class UsersRepo implements IUsersRepo {
  private repo: Repository<User>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(User);
  }

  async getAll(): Promise<User[]> {
    return await this.repo.find();
  }
}

export default UsersRepo;
