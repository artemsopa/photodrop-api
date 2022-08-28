import ApiError from '../domain/error';
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
    if (await this.albumsRepo.isAlbumExists(userId, album.title)) throw new ApiError(400, `Bad Request! Album ${album.title} already exists!`);
    await this.albumsRepo.create(new Album(album.title, album.icon, album.location, userId));
  }
}

export default AlbumsService;
