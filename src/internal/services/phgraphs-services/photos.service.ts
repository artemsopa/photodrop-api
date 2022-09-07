import { v4 as uuidv4 } from 'uuid';
import { PhotoInput } from '../dtos/photo';
import { IPhotosRepo } from '../../repositories/repositories';
import { IS3Storage } from '../../../pkg/storage/s3';
import Photo from '../../repositories/entities/photo';
import ApiError from '../../domain/error';

class PhotosService {
  constructor(private photosRepo: IPhotosRepo, private s3Storage: IS3Storage) {
    this.photosRepo = photosRepo;
    this.s3Storage = s3Storage;
  }

  async getUploadUrl(phgraphId: string, albumId: string, contentType: string) {
    await this.isImageType(contentType);
    const key = `${phgraphId}/${albumId}/${uuidv4()}`;
    const url = await this.s3Storage.getSignedUrlPut(key, contentType);
    return {
      // data: {
      method: 'PUT', url, fields: [], headers: ['content-type'],
      // }, key,
    };
  }

  async createMany(phgraphId: string, albumId: string, photosInp: PhotoInput[]): Promise<void> {
    const photos = photosInp.map((item) => new Photo(item.key, albumId, phgraphId, item.userId));
    await this.photosRepo.createMany(photos);
  }

  private isImageType(contentType: string) {
    return new Promise<boolean>((resolve, reject) => {
      if (contentType.split('/')[0] !== 'image') {
        reject(new ApiError(400, 'Invalid Content-Type!'));
      } else resolve(true);
    });
  };
}

export default PhotosService;
