import { DataSource, Repository, Not } from 'typeorm';
import { ICameristsRepo } from './repository';
import Camerist from './entities/camerist';

class CameristsRepo implements ICameristsRepo {
  private repo: Repository<Camerist>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Camerist);
  }

  async getByLogin(login: string): Promise<Camerist | null> {
    return await this.repo.findOne({ where: { login } });
  }
}

export default CameristsRepo;
