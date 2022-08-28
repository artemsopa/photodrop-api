import { DataSource, Repository } from 'typeorm';
import { IImagesRepo } from './repository';
import Image from './entities/image';

class ImagesRepo implements IImagesRepo {
  private repo: Repository<Image>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Image);
  }

  async getAllByAlbumId(albumId: string): Promise<Image[]> {
    const images = await this.repo.find({
      where: { albumId },
    });
    return images;
  }

  async create(image: Image): Promise<void> {
    await this.repo.save(image);
  }
}

export default ImagesRepo;
