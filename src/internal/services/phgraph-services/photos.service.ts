import { v4 as uuidv4 } from 'uuid';
import { PhotoInput } from '../dtos/photo';
import { IPhotosRepo } from '../../repositories/repositories';
import { IS3Storage } from '../../../pkg/storage/s3';
import Photo from '../../repositories/entities/photo';

class PhotosService {
  constructor(private photosRepo: IPhotosRepo, private s3Storage: IS3Storage) {
    this.photosRepo = photosRepo;
    this.s3Storage = s3Storage;
  }

  async getUploadUrl(phgraphId: string, albumId: string, contentType: string) {
    await this.s3Storage.isImageType(contentType);
    const key = `albums/${phgraphId}/${albumId}/${uuidv4()}`;
    const url = await this.s3Storage.getSignedUrlPut(key, contentType);
    return {
      method: 'PUT', url, fields: [], headers: { 'Content-Type': contentType },
    };
  }

  async createMany(phgraphId: string, albumId: string, photosInp: PhotoInput[]): Promise<void> {
    const photos: Photo[] = [];
    photosInp.forEach((item) => photos.push(...item.users.map((userId) => new Photo(item.key, albumId, phgraphId, userId))));
    await this.photosRepo.createMany(photos);
  }
}

export default PhotosService;
