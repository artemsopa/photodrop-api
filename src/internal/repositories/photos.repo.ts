import { DataSource, Repository } from 'typeorm';
import { IPhotosRepo } from './repositories';
import Photo from './entities/photo';
import Album from './entities/album';

class PhotosRepo implements IPhotosRepo {
  constructor(private ds: DataSource) {
    this.ds = ds;
  }

  async findAlbumsByUser(userId: string): Promise<Album[]> {
    const albums = await this.ds
      .getRepository(Album)
      .createQueryBuilder('albums')
      .leftJoin(
        'albums.photos',
        'photos',
      )
      .where('photos.user_id = :userId', { userId })
      .getMany();
    return albums;
  }

  async findAllByUser(userId: string): Promise<Photo[]> {
    return await this.ds.getRepository(Photo).find({ where: { userId } });
  }

  async findAllByAlbum(userId: string, albumId: string): Promise<Album | null> {
    const album = await this.ds
      .getRepository(Album)
      .createQueryBuilder('albums')
      .leftJoinAndSelect(
        'albums.photos',
        'photos',
        'albums.id = :id',
        {
          id: albumId,
        },
      )
      .where('photos.user_id = :userId', { userId })
      .getOne();
    return album;
    // return await this.ds.getRepository(Photo).find({ where: { userId, albumId } });
  }

  async createMany(photos: Photo[]): Promise<void> {
    await this.ds.getRepository(Photo).save(photos);
  }

  async updateIsPaidByAlbum(userId: string, albumId: string): Promise<void> {
    await this.ds.getRepository(Photo).update({ userId, albumId }, { isPaid: true });
  }
}

export default PhotosRepo;
