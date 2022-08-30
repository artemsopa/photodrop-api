import { v4 as uuidv4 } from 'uuid';
import { PhotoInfo, PhotoInput } from './dtos/photo';
import { IPhotosService } from './service';
import { IPhotosRepo } from '../repository/repository';
import Photo from '../repository/entities/photo';
import { IS3Storage } from '../../pkg/storage/s3';
import ApiError from '../domain/error';

class PhotosService implements IPhotosService {
  constructor(private photosRepo: IPhotosRepo, private s3Storage: IS3Storage) {
    this.photosRepo = photosRepo;
    this.s3Storage = s3Storage;
  }

  async createUploadUrl(cameristId: string, albumId: string, contentType: string) {
    await this.isImageType(contentType);
    const key = `${cameristId}/${albumId}/${uuidv4()}`;
    const url = await this.s3Storage.getSignedUrl(key, contentType);
    return {
      data: {
        method: 'PUT',
        url,
        fields: [],
        headers: ['content-type'],
      },
      key,
    };
  }

  async createMany(cameristId: string, albumId: string, keys: string[]): Promise<void> {
    const photos = keys.map((key) => new Photo(key, albumId, cameristId));
    await this.photosRepo.createMany(photos);
  }

  async getAllByAlbum(cameristId: string, albumId: string): Promise<PhotoInfo[]> {
    return (await this.photosRepo.getAllByAlbum(cameristId, albumId)).map((item) => new PhotoInfo(item.id, item.key));
  }

  private isImageType(contentType: string) {
    return new Promise<boolean>((resolve, reject) => {
      if (contentType.split('/')[0] !== 'image') {
        reject(new ApiError(400, 'Invalid Content-Type!'));
      } else resolve(true);
    });
  }
}

export default PhotosService;
