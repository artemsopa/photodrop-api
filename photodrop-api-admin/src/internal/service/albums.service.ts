import Album from '../repository/entities/album';
import { IAlbumsRepo } from '../repository/repository';
import { AlbumInfo, AlbumInput } from './dtos/album';
import { IAlbumsService } from './service';

class AlbumsService implements IAlbumsService {
  constructor(private albumsRepo: IAlbumsRepo) {
    this.albumsRepo = albumsRepo;
  }

  async getAll(userId: string): Promise<AlbumInfo[]> {
    return (await this.albumsRepo.getAll(userId)).map((item) => new AlbumInfo(
      item.id,
      item.title,
      item.location,
      item.icon,
    ));
  }

  async create(userId: string, album: AlbumInput): Promise<void> {
    await this.albumsRepo.create(new Album(album.title, album.icon, album.location, userId));
  }
}

export default AlbumsService;
