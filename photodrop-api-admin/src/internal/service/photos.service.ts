import { v4 as uuidv4 } from 'uuid';
import { PhotoInfo, PhotoInput } from './dtos/photo';
import { IPhotosService } from './service';
import { IPhotosRepo } from '../repository/repository';
import Photo from '../repository/entities/photo';
import { IS3Storage } from '../../pkg/storage/s3';

class PhotosService implements IPhotosService {
  constructor(private photosRepo: IPhotosRepo, private s3Storage: IS3Storage) {
    this.photosRepo = photosRepo;
    this.s3Storage = s3Storage;
  }

  async createUploadUrl(cameristId: string, albumId: string, cType: string) {
    const key = `${cameristId}/${albumId}/${uuidv4()}`;
    const url = await this.s3Storage.getSignedUrl(key, cType);
    return { url, key };
  }

  async getAllByAlbum(cameristId: string, albumId: string): Promise<PhotoInfo[]> {
    return (await this.photosRepo.getAllByAlbumId(cameristId, albumId)).map((item) => new PhotoInfo(item.id, item.path));
  }

  async createMany(cameristId: string, albumId: string, photo: PhotoInput[]): Promise<void> {
    // await this.photosRepo.create(new Photo(photo.path, photo.albumId, cameristId));
  }
}

export default PhotosService;
