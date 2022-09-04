import { DataSource } from 'typeorm';
import Album from './entities/album';
import Order from './entities/order';
import { IOrdersRepo } from './repository';

class OrdersRepo implements IOrdersRepo {
  constructor(private ds: DataSource) {
    this.ds = ds;
  }

  async createMany(orders: Order[]): Promise<void> {
    await this.ds.getRepository(Order).save(orders);
  }

  async getOrderAlbumsByUser(userId: string): Promise<Album[]> {
    const albums = await this.ds
      .getRepository(Album)
      .createQueryBuilder('albums')
      .leftJoin(
        'albums.orders',
        'orders',
      )
      .where('orders.user_id = :userId', { userId })
      .getMany();
    return albums;
  };

  async getOrderPhotosByUser(userId: string): Promise<Order[]> {
    const orders = await this.ds
      .getRepository(Order)
      .createQueryBuilder('orders')
      .leftJoinAndSelect(
        'orders.photo',
        'photos',
      )
      .where('orders.user_id = :userId', { userId })
      .getMany();
    return orders;
  };

  async getOrderPhotosByAlbumUser(userId: string, albumId: string): Promise<Order[]> {
    const orders = await this.ds
      .getRepository(Order)
      .createQueryBuilder('orders')
      .leftJoinAndSelect(
        'orders.photo',
        'photos',
        'orders.album_id = :albumId',
        { albumId },
      )
      .where('orders.user_id = :userId', { userId })
      .getMany();
    return orders;
  };

  async updateIsPaidOrders(userId: string, albumId: string): Promise<void> {
    await this.ds.getRepository(Order).update({ userId, albumId }, { isPaid: true });
  }
}

// { albumId: '0239b9ba-cf0e-44d1-b00a-5ff6083be7c5' },
// .where('orders.user_id = :userId', { userId: '0239b9ba-cf0e-44d1-b00a-5ff6083basnx' }) // asnx

export default OrdersRepo;
