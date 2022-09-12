import { PhotoInfo } from '../dtos/photo';
import { IGalleryService } from '../services';
import { IPhotosRepo } from '../../repositories/repositories';
import { IS3Storage } from '../../../pkg/storage/s3';
import { AlbumInfo, AlbumWithPhotos } from '../dtos/album';
import ApiError from '../../domain/error';

class GalleryService implements IGalleryService {
  constructor(private photosRepo: IPhotosRepo, private s3Storage: IS3Storage) {
    this.photosRepo = photosRepo;
    this.s3Storage = s3Storage;
  }

  async getAllByUser(userId: string): Promise<{ albums: AlbumInfo[], photos: PhotoInfo[]; }> {
    const albumsRepo = await this.photosRepo.findAlbumsByUser(userId);
    const albums = albumsRepo.map((item) => new AlbumInfo(item.id, item.title, item.location, item.date));

    const photosRepo = await this.photosRepo.findAllByUser(userId);
    const photos = await Promise.all(photosRepo.map(async (item) => new PhotoInfo(item.id, await this.s3Storage.getSignedUrlGet(item.key))));

    return { albums, photos };
  }

  async getAllPhotosByAlbum(userId: string, albumId: string): Promise<AlbumWithPhotos> {
    const albumRepo = await this.photosRepo.findAllByAlbum(userId, albumId);
    if (!albumRepo) throw new ApiError(404, 'Requested album not found!');
    const photos = await Promise.all(albumRepo.photos.map(async (item) => new PhotoInfo(item.id, await this.s3Storage.getSignedUrlGet(item.key))));

    return new AlbumWithPhotos(albumRepo.id, albumRepo.title, albumRepo.location, albumRepo.date, photos);
  }

  async payForAlbum(userId: string, albumId: string): Promise<void> {
    await this.photosRepo.updateIsPaidByAlbum(userId, albumId);
  }
}

export default GalleryService;
