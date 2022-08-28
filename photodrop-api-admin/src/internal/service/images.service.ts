import { ImageInfo, ImageInput } from './dtos/image';
import { IImagesService } from './service';
import { IImagesRepo } from './../repository/repository';
import Image from '../repository/entities/image';

class ImageService implements IImagesService {
  constructor(private imagesRepo: IImagesRepo) {
    this.imagesRepo = imagesRepo;
  }

  async getAll(userId: string, albumId: string): Promise<ImageInfo[]> {
    return (await this.imagesRepo.getAllByAlbumId(albumId)).map(item => new ImageInfo(item.id, item.path));
  }

  async create(userId: string, image: ImageInput): Promise<void> {
    await this.imagesRepo.create(new Image(image.path, image.albumId));
  }
}
