import { DataSource } from 'typeorm';
import { IOrdersRepo } from './repositories';
import Album from './entities/album';
import Order from './entities/order';

class OrdersRepo implements IOrdersRepo {
  constructor(private ds: DataSource) {
    this.ds = ds;
  }

  async findAllAlbumsByUser(userId: string): Promise<Album[]> {
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
  }

  async findLastPhotoOrder(userId: string, albumId: string): Promise<Order | null> {
    const order = await this.ds
      .getRepository(Order)
      .createQueryBuilder('orders')
      .leftJoinAndSelect(
        'orders.photo',
        'photos',
        'orders.album_id = :id',
        {
          id: albumId,
        },
      )
      .where('orders.user_id = :userId', { userId })
      .orderBy('RAND()')
      .getOne();
    return order;
  }

  async findAllPhotosByUser(userId: string): Promise<Order[]> {
    const orders = await this.ds
      .getRepository(Order)
      .createQueryBuilder('orders')
      .leftJoinAndSelect(
        'orders.photo',
        'photos',
        'orders.user_id = :id',
        {
          id: userId,
        },
      )
      .getMany();
    return orders;
  }

  async findAlbum(userId: string, albumId: string): Promise<Album | null> {
    const album = await this.ds
      .getRepository(Album)
      .createQueryBuilder('albums')
      .leftJoin(
        'albums.orders',
        'orders',
        'orders.album_id = :id',
        {
          id: albumId,
        },
      )
      .where('orders.user_id = :userId', { userId })
      .getOne();
    return album;
  }

  async findAllByAlbum(userId: string, albumId: string): Promise<Order[]> {
    const orders = await this.ds
      .getRepository(Order)
      .createQueryBuilder('orders')
      .leftJoinAndSelect(
        'orders.photo',
        'photos',
        'orders.album_id = :id',
        {
          id: albumId,
        },
      )
      .where('orders.user_id = :userId', { userId })
      .getMany();
    return orders;
  }

  async createMany(orders: Order[]): Promise<void> {
    await this.ds.getRepository(Order).save(orders);
  }

  async updateIsPaidByAlbum(userId: string, albumId: string): Promise<void> {
    await this.ds.getRepository(Order).update({ userId, albumId }, { isPaid: true });
  }
}

export default OrdersRepo;
