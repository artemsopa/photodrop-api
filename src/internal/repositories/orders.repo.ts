import { DataSource } from 'typeorm';
import { IOrdersRepo } from './repositories';
import Photo from './entities/photo';
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

  async findAllPhotosByUser(userId: string): Promise<Photo[]> {
    const photos = await this.ds
      .getRepository(Photo)
      .createQueryBuilder('photos')
      .leftJoin(
        'photos.orders',
        'orders',
      )
      .where('orders.user_id = :userId', { userId })
      .getMany();
    return photos;
  }

  async findAllByAlbum(userId: string, albumId: string): Promise<Album | null> {
    const album = await this.ds
      .getRepository(Album)
      .createQueryBuilder('albums')
      .leftJoinAndSelect(
        'albums.photos',
        'photos',
        'albums.id = :id',
        {
          id: albumId,
        },
      )
      .where('photos.user_id = :userId', { userId })
      .getOne();
    return album;
  }

  async createMany(orders: Order[]): Promise<void> {
    await this.ds.getRepository(Order).save(orders);
  }

  async updateIsPaidByAlbum(userId: string, albumId: string): Promise<void> {
    await this.ds.getRepository(Order).update({ userId, albumId }, { isPaid: true });
  }
}

export default OrdersRepo;
