import Order from '../repository/entities/order';
import { IOrdersRepo } from '../repository/repository';
import { OrderInput } from './dtos/order';
import { IOrdersService } from './service';

class OrdersService implements IOrdersService {
  constructor(private repo: IOrdersRepo) {
    this.repo = repo;
  }

  async createOrder(cameristId: string, albumId: string, ordersInp: OrderInput[]): Promise<void> {
    const orders: Order[] = [];
    ordersInp.forEach((order) => orders.push(...order.userIds.map((userId) => new Order(cameristId, albumId, order.photoId, userId))));
    console.log(orders);
    await this.repo.createMany(orders);
  }
}

export default OrdersService;
