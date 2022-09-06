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

  async findOneByPhone(phone: string): Promise<User | null> {
    return await this.repo.findOne({ where: { phone } });
  }

  async create(user: User): Promise<User> {
    return await this.repo.save(user);
  }

  async updatePhone(id: string, phone: string): Promise<void> {
    await this.repo.update({ id }, { phone });
  }

  async updateEmail(id: string, email: string): Promise<void> {
    await this.repo.update({ id }, { email });
  }

  async updateFullName(id: string, fullName: string): Promise<void> {
    await this.repo.update({ id }, { fullName });
  }

  async updateAvatar(id: string, avatar: string): Promise<void> {
    await this.repo.update({ id }, { avatar });
  }
}

export default UsersRepo;
