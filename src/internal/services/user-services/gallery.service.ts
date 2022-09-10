import { PhotoInfo } from '../dtos/photo';
import { IGalleryService } from '../services';
import { IPhotosRepo } from '../../repositories/repositories';
import { IS3Storage } from '../../../pkg/storage/s3';
import { AlbumInfo } from '../dtos/album';

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

  async getAllPhotosByAlbum(userId: string, albumId: string): Promise<PhotoInfo[]> {
    const photosRepo = await this.photosRepo.findAllByAlbum(userId, albumId);
    const photos = await Promise.all(photosRepo.map(async (item) => new PhotoInfo(item.id, await this.s3Storage.getSignedUrlGet(item.key))));

    return photos;
  }

  async payForAlbum(userId: string, albumId: string): Promise<void> {
    await this.photosRepo.updateIsPaidByAlbum(userId, albumId);
  }
}

export default GalleryService;
