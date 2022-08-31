import { DataSource, Repository } from 'typeorm';
import Album from './entities/album';
import Order from './entities/order';
import { IOrdersRepo } from './repository';

class OrdersRepo implements IOrdersRepo {
  private repo: Repository<Album>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Album);
  }

  async createMany(orders: Order[]): Promise<void> {
    await this.repo.save(orders);
  }
}

export default OrdersRepo;
