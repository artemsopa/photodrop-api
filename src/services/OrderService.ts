import { DataSource } from 'typeorm';
import { Order } from '@/entities/Order';
import { OrderInput } from '@/dtos/order';

export class OrderService {
  constructor(private readonly ds: DataSource) {
    this.ds = ds;
  }

  public createMany = async (photographerId: string, albumId: string, ordersInput: OrderInput[]) => {
    await this.ds.initialize();

    const orders: Order[] = [];
    ordersInput.forEach((item) => orders.push(...item.users.map(
      (userId) => new Order(photographerId, albumId, item.photoId, userId),
    )));
    await this.ds.getRepository(Order).save(orders);
  };
}
