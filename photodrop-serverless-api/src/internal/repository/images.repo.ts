import { DataSource, Repository } from 'typeorm';
import { IImagesRepo } from './repository';
import Image from './entities/image';

class ImagesRepo implements IImagesRepo {
  private repo: Repository<Image>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Image);
  }

  async getAllByAlbumId(albumId: string): Promise<Image[]> {
    return await this.repo.find({ where: { albumId } });
  }

  async create(image: Image): Promise<void> {
    await this.repo.save(image);
  }
}

export default ImagesRepo;
