import { DataSource } from 'typeorm';
import { Album } from '@/entities/Album';
import { ApiError } from '@/utils/ApiError';
import { AlbumItem, AlbumInput } from '@/dtos/album';

export class AlbumService {
  constructor(private readonly ds: DataSource) {
    this.ds = ds;
  }

  public getAllByPhotographer = async (photographerId: string) => {
    await this.ds.initialize().catch();

    const data = await this.ds.getRepository(Album).find({ where: { photographerId } });
    const albums = data.map((item) => new AlbumItem(item.id, item.title, item.location, item.date));
    return albums;
  };

  public create = async (photographerId: string, album: AlbumInput) => {
    await this.ds.initialize().catch();

    const data = await this.ds.getRepository(Album).findOne({
      where: {
        title: album.title,
        photographerId,
      },
    });
    if (data) throw ApiError.badRequest(`Album "${album.title}" already exists`);
    await this.ds.getRepository(Album).save(new Album(album.title, album.location, album.date, photographerId));
  };
}
