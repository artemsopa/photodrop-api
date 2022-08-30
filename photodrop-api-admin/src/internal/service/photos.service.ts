import { PhotoInfo, PhotoInput } from './dtos/photo';
import { IPhotosService } from './service';
import { IPhotosRepo } from '../repository/repository';
import Photo from '../repository/entities/photo';

class PhotosService implements IPhotosService {
  constructor(private photosRepo: IPhotosRepo) {
    this.photosRepo = photosRepo;
  }

  async getAllByAlbum(cameristId: string, albumId: string): Promise<PhotoInfo[]> {
    return (await this.photosRepo.getAllByAlbumId(cameristId, albumId)).map((item) => new PhotoInfo(item.id, item.path));
  }

  async createMany(cameristId: string, albumId: string, photo: PhotoInput[]): Promise<void> {
    // await this.photosRepo.create(new Photo(photo.path, photo.albumId, cameristId));
  }
}

export default PhotosService;
