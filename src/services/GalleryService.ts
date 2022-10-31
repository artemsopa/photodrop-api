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
    if (!this.ds.manager.connection.isInitialized) await this.ds.initialize();

    const data = await this.ds.getRepository(Order).createQueryBuilder('orders')
      .leftJoinAndSelect('orders.album', 'albums')
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
          key: item.photo.key,
          url: await this.bucket.getSignedUrlGetObject(
            item.photo.key
              .replace(
                /original/g,
                item.isPaid
                  ? 'thumbnail'
                  : 'thumbnail-watermark',
              ),
          ),
          albumId: item.albumId,
        });
      }
    }

    const photosArr = Array.from(photosMap, ([name, value]) => (value));

    const albums = await Promise.all(
      Array.from(albumsMap, ([name, value]) => (value))
        .map(async (album) => {
          const albumPhotos = photosArr.filter((photo) => photo.albumId === album.id);
          return new AlbumInfo(
            album.id,
            await this.bucket.getSignedUrlGetObject(
              albumPhotos[Math.floor(Math.random() * albumPhotos.length)]
                .key.replace(
                  /original/g,
                  'album-cover',
                ),
            ),
            album.title,
            album.location,
            album.date,
          );
        }),
    );
    const photos = photosArr.map((item) => ({ id: item.id, url: item.url }));

    return {
      albums,
      photos,
    };
  };

  public getAllPhotosByAlbum = async (userId: string, albumId: string) => {
    if (!this.ds.manager.connection.isInitialized) await this.ds.initialize();

    const data = await this.ds.getRepository(Order).createQueryBuilder('orders')
      .leftJoinAndSelect('orders.album', 'albums')
      .leftJoinAndSelect('orders.photo', 'photos')
      .where('orders.user_id = :userId', { userId })
      .andWhere('orders.album_id = :albumId', { albumId })
      .getMany();

    const [{ album }] = data;
    const photos = await Promise.all(data.map(async (item) => ({
      id: item.id,
      smallUrl: await this.bucket.getSignedUrlGetObject(
        item.isPaid
          ? item.photo.key.replace(
            /original/g,
            'thumbnail',
          ) : item.photo.key.replace(
            /original/g,
            'thumbnail-watermark',
          ),
      ),
      largeUrl: await this.bucket.getSignedUrlGetObject(
        item.isPaid
          ? item.photo.key.replace(
            /original/g,
            'original',
          ) : item.photo.key.replace(
            /original/g,
            'original-watermark',
          ),
      ),
    })));

    return {
      id: album.id,
      title: album.title,
      location: album.location,
      date: album.date,
      photos,
    };
  };

  public payForAlbum = async (userId: string, albumId: string) => {
    if (!this.ds.manager.connection.isInitialized) await this.ds.initialize();

    await this.ds.getRepository(Order).update({ userId, albumId }, { isPaid: true });
  };
}
