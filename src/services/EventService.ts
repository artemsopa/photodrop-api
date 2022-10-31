import { S3EventRecord } from 'aws-lambda';
import sharp from 'sharp';
import path from 'path';
import { readFile } from 'fs/promises';
import { DataSource } from 'typeorm';
import { Bucket } from '@/utils/Bucket';
import { Otp } from '@/utils/Otp';
import { Message } from '@/dtos/message';
import { Album } from '@/entities/Album';

export class EventService {
  constructor(
    private readonly bucket: Bucket,
    private readonly rootDir: string,
    private readonly ds: DataSource,
    private readonly otp: Otp,
  ) {
    this.bucket = bucket;
    this.rootDir = rootDir;
    this.ds = ds;
    this.otp = otp;
  }

  public resize = async (record: S3EventRecord) => {
    const { key } = record.s3.object;

    const { Body, ContentType } = await this.bucket.getObject(key);

    const body = Body! as Buffer;
    const contentType = ContentType!;

    const metadata = await sharp(body).metadata();

    const watermarkPath = path.join(this.rootDir, 'assets', 'logo.png');
    const watermark = await readFile(watermarkPath);

    const originalKey = key.replace(/originals/g, 'albums');
    const originalWatermarkKey = originalKey.replace(/original/g, 'original-watermark');
    const thumbnailKey = originalKey.replace(/original/g, 'thumbnail');
    const thumbnaillWatermarkKey = originalKey.replace(/original/g, 'thumbnail-watermark');
    const albumCoverKey = originalKey.replace(/original/g, 'album-cover');

    const originalResizedWatermark = await sharp(watermark)
      .resize({
        width: Math.round(metadata.width! / 3),
      })
      .png()
      .toBuffer();

    const thumbnailResizedWatermark = await sharp(watermark)
      .resize({
        width: 100,
      })
      .png()
      .toBuffer();

    const originalWatermarkBuffer = await sharp(body)
      .flatten(true)
      .composite([{
        input: originalResizedWatermark,
        gravity: 'center',
      }])
      .sharpen()
      .toBuffer();

    const thumbnailBuffer = await sharp(body)
      .resize(300, 300, {
        fit: 'cover',
      })
      .toBuffer();

    const thumbnailWatermarkBuffer = await sharp(body)
      .composite([{
        input: thumbnailResizedWatermark,
        gravity: 'center',
      }])
      .resize(300, 300, {
        fit: 'cover',
      })
      .sharpen()
      .toBuffer();

    const albumCoverBuffer = await sharp(body)
      .resize(200, 255, {
        fit: 'cover',
      })
      .toBuffer();

    await this.bucket.putObject(originalKey, body, contentType);
    await this.bucket.putObject(originalWatermarkKey, originalWatermarkBuffer, contentType);
    await this.bucket.putObject(thumbnailKey, thumbnailBuffer, contentType);
    await this.bucket.putObject(thumbnaillWatermarkKey, thumbnailWatermarkBuffer, contentType);
    await this.bucket.putObject(albumCoverKey, albumCoverBuffer, contentType);
  };

  public notificatePhotosUploaded = async (message: Message) => {
    if (!this.ds.manager.connection.isInitialized) await this.ds.initialize();

    const album = await this.ds.getRepository(Album).findOneBy({ id: message.albumId });
    if (!album) throw new Error('Unknown album');

    const promises = message.phones.map(async (phone) => {
      try {
        // const res = await this.otp.sendSms(
        //   phone,
        //   `Find new photos at "${album.title}" album!`,
        // );
        console.log(`${phone} sms status: successfull`); // console.log(`${phone} sms status: ${res.status}`);
      } catch (error) {
        console.log(`${phone} sms status: failed`);
      }
    });
    await Promise.all(promises);
  };
}
