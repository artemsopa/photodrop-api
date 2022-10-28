import { DataSource } from 'typeorm';
import { Bucket } from '@/utils/Bucket';
import { Order } from '@/entities/Order';
import { AlbumInfo } from '@/dtos/album';
import { PhotoInfo } from '@/dtos/photo';

export class GalleryService {
  constructor(private readonly ds: DataSource, private readonly bucket: Bucket) {
    this.ds = ds;
    this.bucket = bucket;
  }

  public getAllByUser = async (userId: string) => {
    await this.ds.initialize().catch();

    const data = await this.ds.getRepository(Order).createQueryBuilder('orders')
      .leftJoinAndSelect('albums.orders', 'orders')
      .leftJoinAndSelect('orders.photo', 'photos')
      .where('orders.user_id = :userId', { userId })
      .getMany();

    const albumsMap = new Map();
    const photosMap = new Map();

    for await (const item of data) {
      const album = albumsMap.get(item.albumId);
      if (!album) {
        albumsMap.set(item.albumId, {
          id: item.album.id,
          title: item.album.title,
          location: item.album.location,
          date: item.album.date,
        });
      }
      const photo = photosMap.get(item.photoId);
      if (!photo) {
        photosMap.set(item.photoId, {
          id: item.id,
          isPaid: item.isPaid,
          url: await this.bucket.getSignedUrlGetObject(item.photo.key),
          albumId: item.albumId,
        });
      }
    }

    const photosArr = Array.from(photosMap, ([name, value]) => (value));

    const albums = Array.from(albumsMap, ([name, value]) => (value))
      .map((album) => new AlbumInfo(
        album.id,
        photosArr.filter((photo) => photo.albumId === album.id)[Math.floor(Math.random() * photosArr.length)].url,
        album.title,
        album.location,
        album.date,
      ));
    const photos = photosArr.map((item) => new PhotoInfo(item.id, item.isPaid, item.url));

    return {
      albums,
      photos,
    };
  };

  public getAllPhotosByAlbum = async (userId: string, albumId: string) => {
    await this.ds.initialize().catch();

    const data = await this.ds.getRepository(Order).createQueryBuilder('orders')
      .leftJoinAndSelect('albums.orders', 'orders')
      .leftJoinAndSelect('orders.photo', 'photos')
      .where('orders.user_id = :userId', { userId })
      .andWhere('orders.album_id = :albumId', { albumId })
      .getMany();

    const [{ album }] = data;
    const photos = await Promise.all(data.map(async (item) => new PhotoInfo(
      item.id,
      item.isPaid,
      await this.bucket.getSignedUrlGetObject(item.photo.key),
    )));

    return {
      id: album.id,
      title: album.title,
      location: album.location,
      date: album.date,
      photos,
    };
  };

  public payForAlbum = async (userId: string, albumId: string) => {
    await this.ds.initialize().catch();

    await this.ds.getRepository(Order).update({ userId, albumId }, { isPaid: true });
  };
}
