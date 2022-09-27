import { DataSource, Repository } from 'typeorm';
import { IPhotosRepo } from './repositories';
import Photo from './entities/photo';

class PhotosRepo implements IPhotosRepo {
  private repo: Repository<Photo>;
  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Photo);
  }

  async findAll(phgraphId: string): Promise<Photo[]> {
    return await this.repo.find({ where: { phgraphId } });
  }

  async findAllByAlbum(phgraphId: string, albumId: string): Promise<Photo[]> {
    return await this.repo.find({ where: { phgraphId, albumId } });
  }

  async createMany(photos: Photo[]): Promise<void> {
    await this.repo.save(photos);
  }
}

export default PhotosRepo;
