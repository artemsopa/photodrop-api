import { DataSource, In } from 'typeorm';
import { Order } from '@/entities/Order';
import { OrderInput } from '@/dtos/order';
import { Queue } from '@/utils/Queue';
import { User } from '@/entities/User';

export class OrderService {
  constructor(private readonly ds: DataSource, private readonly queue: Queue) {
    this.ds = ds;
    this.queue = queue;
  }

  public createMany = async (photographerId: string, albumId: string, ordersInput: OrderInput[]) => {
    if (!this.ds.manager.connection.isInitialized) await this.ds.initialize();

    const ids = new Set<string>();
    const orders: Order[] = [];
    ordersInput.forEach((item) => orders.push(...item.users.map(
      (userId) => {
        ids.add(userId);
        return new Order(photographerId, albumId, item.photoId, userId);
      },
    )));
    await this.ds.getRepository(Order).save(orders);

    const users = await this.ds.getRepository(User).find({ where: { id: In(Array.from(ids)) } });
    const phones = users.map((user) => user.phone);

    await this.queue.enqueueMessage({ albumId, phones });
  };
}
