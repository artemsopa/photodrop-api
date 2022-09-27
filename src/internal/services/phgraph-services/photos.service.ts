import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { IPhotosRepo, IUsersRepo } from '../../repositories/repositories';
import { IS3Storage } from '../../../pkg/storage/s3';
import Photo from '../../repositories/entities/photo';
import { UserInfo } from '../dtos/user';
import { PhotoInfo } from '../dtos/photo';

class PhotosService {
  constructor(private photosRepo: IPhotosRepo, private usersRepo: IUsersRepo, private s3Storage: IS3Storage) {
    this.photosRepo = photosRepo;
    this.s3Storage = s3Storage;
  }

  async getUsersAndPhotosByAlbum(phgraphId: string, albumId: string): Promise<{ photos: PhotoInfo[], users: UserInfo[] }> {
    const photosRepo = await this.photosRepo.findAllByAlbum(phgraphId, albumId);
    const photos = await Promise.all(
      photosRepo.map(async (item) => new PhotoInfo(item.id, await this.s3Storage.getSignedUrlGet(item.key))),
    );

    const usersRepo = await this.usersRepo.findAll();
    const users = await Promise.all(usersRepo.map(async (item) => new UserInfo(
      item.id,
      item.phone,
      item.fullName,
      item.email,
      item.avatar ? await this.s3Storage.getSignedUrlGet(item.avatar) : null,
    )));

    return {
      photos, users,
    };
  }

  async getUploadUrl(phgraphId: string, albumId: string, contentType: string) {
    await this.s3Storage.isImageType(contentType);
    const key = `albums/${phgraphId}/${albumId}/${uuidv4()}.${mime.extension(contentType)}`;
    const url = await this.s3Storage.getSignedUrlPut(key, contentType);
    return {
      data: {
        method: 'PUT', url, fields: [], headers: { 'Content-Type': contentType },
      },
      key,
    };
  }

  async createMany(phgraphId: string, albumId: string, keys: string[]): Promise<void> {
    const photos = keys.map((key) => new Photo(key, albumId, phgraphId));
    await this.photosRepo.createMany(photos);
  }
}

export default PhotosService;
