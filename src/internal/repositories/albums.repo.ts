import { DataSource, Repository } from 'typeorm';
import { IAlbumsRepo } from './repositories';
import Album from './entities/album';

class AlbumsRepo implements IAlbumsRepo {
  private repo: Repository<Album>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Album);
  }

  async findAll(phgraphId: string): Promise<Album[]> {
    return await this.repo.find({ where: { phgraphId } });
  }

  async isAlbumExists(phgraphId: string, title: string): Promise<boolean> {
    const album = await this.repo.findOne({
      where: {
        title,
        phgraphId,
      },
    });
    return !!album;
  }

  async create(album: Album): Promise<void> {
    await this.repo.save(album);
  }
}

export default AlbumsRepo;
