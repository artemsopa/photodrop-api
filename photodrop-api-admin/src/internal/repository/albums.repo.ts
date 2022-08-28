import { DataSource, Repository } from 'typeorm';
import { IAlbumsRepo } from './repository';
import Album from './entities/album';

class AlbumsRepo implements IAlbumsRepo {
  private repo: Repository<Album>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Album);
  }

  async getAll(id: string): Promise<Album[]> {
    const albums = await this.repo.find({
      where: { id },
    });
    return albums;
  }

  async create(album: Album): Promise<void> {
    await this.repo.save(album);
  }
}

export default AlbumsRepo;
