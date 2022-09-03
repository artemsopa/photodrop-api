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

  async create(user: User): Promise<void> {
    await this.repo.save(user);
  }

  async updatePhone(userId: string, phone: string): Promise<void> {
    await this.repo.update(userId, { phone });
  }

  async updateEmail(userId: string, email: string): Promise<void> {
    await this.repo.update(userId, { email });
  }

  async updateFullName(userId: string, fullName: string): Promise<void> {
    await this.repo.update(userId, { fullName });
  }

  async updateAvatar(userId: string, avatar: string): Promise<void> {
    await this.repo.update(userId, { avatar });
  }
}

export default UsersRepo;
