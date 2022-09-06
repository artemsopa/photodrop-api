import { DataSource, Repository } from 'typeorm';
import { IPhgraphsRepo } from './repositories';
import Phgraph from './entities/phgraph';

class PhgraphsRepo implements IPhgraphsRepo {
  private repo: Repository<Phgraph>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Phgraph);
  }

  async findByLogin(login: string): Promise<Phgraph | null> {
    return await this.repo.findOne({ where: { login } });
  }
}

export default PhgraphsRepo;
