import { DataSource, Repository } from 'typeorm';
import { IAlbumsRepo } from './repository';
import Album from './entities/album';

class AlbumsRepo implements IAlbumsRepo {
  private repo: Repository<Album>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Album);
  }

  async getAll(id: string): Promise<Album[]> {
    return await this.repo.find({ where: { id } });
  }

  async isAlbumExists(userId: string, id: string): Promise<boolean> {
    const album = await this.repo.findOne({
      where: {
        id,
        userId,
      },
    });
    return !!album;
  }

  async create(album: Album): Promise<void> {
    await this.repo.save(album);
  }
}

export default AlbumsRepo;
