import ApiError from '../domain/error';
import Album from '../repository/entities/album';
import { IAlbumsRepo } from '../repository/repository';
import { AlbumInfo, AlbumInput } from './dtos/album';
import { IAlbumsService } from './service';

class AlbumsService implements IAlbumsService {
  constructor(private albumsRepo: IAlbumsRepo) {
    this.albumsRepo = albumsRepo;
  }

  async getAll(cameristId: string): Promise<AlbumInfo[]> {
    return (await this.albumsRepo.getAll(cameristId)).map((item) => new AlbumInfo(
      item.id,
      item.title,
      item.location,
      item.date,
    ));
  }

  async create(cameristId: string, album: AlbumInput): Promise<void> {
    if (await this.albumsRepo.isAlbumExists(cameristId, album.title)) throw new ApiError(400, `Bad Request! Album ${album.title} already exists!`);
    await this.albumsRepo.create(new Album(album.title, album.location, album.date, cameristId));
  }
}

export default AlbumsService;
