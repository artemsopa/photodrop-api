import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { extension } from 'mime-types';
import { Bucket } from '@/utils/Bucket';
import { Photo } from '@/entities/Photo';
import { PhotoItem } from '@/dtos/photo';
import { User } from '@/entities/User';
import { UserInfo } from '@/dtos/user';

export class PhotoService {
  constructor(private readonly ds: DataSource, private readonly bucket: Bucket) {
    this.ds = ds;
    this.bucket = bucket;
  }

  public getUsersAndPhotosByAlbum = async (photographerId: string, albumId: string) => {
    await this.ds.initialize().catch();

    const dataPhotos = await this.ds.getRepository(Photo).find({ where: { photographerId, albumId } });
    const photos = await Promise.all(
      dataPhotos.map(async (item) => new PhotoItem(
        item.id,
        await this.bucket.getSignedUrlGetObject(item.key),
      )),
    );

    const dataUsers = await this.ds.getRepository(User).find();
    const users = await Promise.all(
      dataUsers.map(async (item) => new UserInfo(
        item.id,
        item.phone,
        item.fullName,
        item.email,
        item.avatar
          ? await this.bucket.getSignedUrlGetObject(item.avatar)
          : null,
      )),
    );
    return { photos, users };
  };

  public getUploadUrl = async (photographerId: string, albumId: string, contentType: string) => {
    await this.ds.initialize().catch();

    await this.bucket.isImageConentType(contentType);
    const key = `albums/${photographerId}/${albumId}/${uuidv4()}.${extension(contentType)}`;
    const url = await this.bucket.getSignedUrlPutObject(key, contentType);
    return {
      data: {
        method: 'PUT',
        url,
        fields: [],
        headers: { 'Content-Type': contentType },
      },
      key,
    };
  };

  public createMany = async (photographerId: string, albumId: string, keys: string[]) => {
    await this.ds.initialize().catch();

    const photos = keys.map((key) => new Photo(key, albumId, photographerId));
    await this.ds.getRepository(Photo).save(photos);
  };
}
