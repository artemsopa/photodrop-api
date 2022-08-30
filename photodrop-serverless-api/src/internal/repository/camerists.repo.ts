import { DataSource, Repository, Not } from 'typeorm';
import { ICameristsRepo } from './repository';
import Camerist from './entities/camerist';

class CameristsRepo implements ICameristsRepo {
  private repo: Repository<Camerist>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Camerist);
  }

  async getAll(id: string): Promise<Camerist[]> {
    return await this.repo.find({ where: { id: Not(id) } });
  }

  async isLoginExists(login: string): Promise<boolean> {
    const camerist = await this.repo.findOne({
      where: {
        login,
      },
    });
    return !!camerist;
  }

  async isEmailExists(email: string): Promise<boolean> {
    const camerist = await this.repo.findOne({
      where: {
        email,
      },
    });
    return !!camerist;
  }

  async getByLogin(login: string): Promise<Camerist | null> {
    return await this.repo.findOne({ where: { login } });
  }

  async create(camerist: Camerist): Promise<void> {
    await this.repo.save(camerist);
  }
}

export default CameristsRepo;
