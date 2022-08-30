import { DataSource, Repository } from 'typeorm';
import { IPhotosRepo } from './repository';
import Photo from './entities/photo';

class PhotosRepo implements IPhotosRepo {
  private repo: Repository<Photo>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Photo);
  }

  async getAllByAlbumId(albumId: string, cameristId: string): Promise<Photo[]> {
    return await this.repo.find({ where: { albumId, cameristId } });
  }

  async create(photo: Photo): Promise<void> {
    await this.repo.save(photo);
  }
}

export default PhotosRepo;
