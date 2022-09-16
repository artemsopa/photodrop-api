import { IAlbumsRepo } from '../../repositories/repositories';
import { AlbumInfo, AlbumInput } from '../dtos/album';
import { IAlbumsService } from '../services';
import Album from '../../repositories/entities/album';
import ApiError from '../../../pkg/error/api.error';

class AlbumsService implements IAlbumsService {
  constructor(private albumsRepo: IAlbumsRepo) {
    this.albumsRepo = albumsRepo;
  }

  async getAll(phgraphId: string): Promise<AlbumInfo[]> {
    return (await this.albumsRepo.findAll(phgraphId)).map((item) => new AlbumInfo(
      item.id,
      item.title,
      item.location,
      item.date,
    ));
  }

  async create(phgraphId: string, album: AlbumInput): Promise<void> {
    if (await this.albumsRepo.isAlbumExists(phgraphId, album.title)) throw new ApiError(400, `Bad Request! Album ${album.title} already exists!`);
    await this.albumsRepo.create(new Album(album.title, album.location, album.date, phgraphId));
  }
}

export default AlbumsService;
