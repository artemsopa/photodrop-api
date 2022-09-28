import { PhotoInfo } from '../dtos/photo';
import { IGalleryService } from '../services';
import { IOrdersRepo } from '../../repositories/repositories';
import { IS3Storage } from '../../../pkg/storage/s3';
import { AlbumInfo, AlbumWithPhotos } from '../dtos/album';
import ApiError from '../../../pkg/error/api.error';

class GalleryService implements IGalleryService {
  constructor(private ordersRepo: IOrdersRepo, private s3Storage: IS3Storage) {
    this.ordersRepo = ordersRepo;
    this.s3Storage = s3Storage;
  }

  async getAllByUser(userId: string): Promise<{ albums: AlbumInfo[], photos: PhotoInfo[]; }> {
    const albumsRepo = await this.ordersRepo.findAllAlbumsByUser(userId);
    const albums = await Promise.all(albumsRepo.map(
      async (item) => {
        const order = await this.ordersRepo.findLastPhotoOrder(userId, item.id);
        return new AlbumInfo(item.id, !order || !order.photo ? null : await this.s3Storage
          .getSignedUrlGet(order.photo.key), item.title, item.location, item.date);
      },
    ));

    const ordersRepo = await this.ordersRepo.findAllPhotosByUser(userId);
    const photos = await Promise.all(ordersRepo.map(async (item) => new PhotoInfo(item.id, item.isPaid, await this.s3Storage.getSignedUrlGet(item.photo.key))));

    return { albums, photos };
  }

  async getAllPhotosByAlbum(userId: string, albumId: string): Promise<AlbumWithPhotos> {
    const albumRepo = await this.ordersRepo.findAlbum(userId, albumId);
    if (!albumRepo) throw new ApiError(404, 'Requested album not found!');
    const orders = await this.ordersRepo.findAllByAlbum(userId, albumId);
    const photos = await Promise.all(orders.map(async (item) => new PhotoInfo(item.id, item.isPaid, await this.s3Storage.getSignedUrlGet(item.photo.key))));

    return new AlbumWithPhotos(albumRepo.id, albumRepo.title, albumRepo.location, albumRepo.date, photos);
  }

  async payForAlbum(userId: string, albumId: string): Promise<void> {
    await this.ordersRepo.updateIsPaidByAlbum(userId, albumId);
  }
}

export default GalleryService;
