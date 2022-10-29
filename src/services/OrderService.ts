import { DataSource } from 'typeorm';
import { Order } from '@/entities/Order';
import { OrderInput } from '@/dtos/order';
import { Queue } from '@/utils/Queue';

export class OrderService {
  constructor(private readonly ds: DataSource, private readonly queue: Queue) {
    this.ds = ds;
    this.queue = queue;
  }

  public createMany = async (photographerId: string, albumId: string, ordersInput: OrderInput[]) => {
    if (!this.ds.manager.connection.isInitialized) await this.ds.initialize();

    const phones = new Set<string>();
    const orders: Order[] = [];
    ordersInput.forEach((item) => orders.push(...item.users.map(
      (user) => {
        phones.add(user.phone);
        return new Order(photographerId, albumId, item.photoId, user.userId);
      },
    )));
    await this.ds.getRepository(Order).save(orders);
    await this.queue.enqueueMessage({ albumId, phones: Array.from(phones) });
  };
}
