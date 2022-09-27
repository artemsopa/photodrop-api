import { IOrdersRepo } from '../../repositories/repositories';
import { OrderInput } from '../dtos/order';
import Order from '../../repositories/entities/order';

class OrdersService {
  constructor(private ordersRepo: IOrdersRepo) {
    this.ordersRepo = ordersRepo;
  }

  async createMany(phgraphId: string, albumId: string, ordersInp: OrderInput[]): Promise<void> {
    const orders = ordersInp.map((item) => new Order(phgraphId, albumId, item.photoId, item.userId));
    await this.ordersRepo.createMany(orders);
  }
}

export default OrdersService;
