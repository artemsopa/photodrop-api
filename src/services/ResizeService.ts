import { S3EventRecord } from 'aws-lambda';
import sharp from 'sharp';
import path from 'path';
import { Bucket } from '@/utils/Bucket';

export class ResizeService {
  constructor(private readonly bucket: Bucket) {
    this.bucket = bucket;
  }

  public resize = async (record: S3EventRecord) => {
    const originalKey = record.s3.object.key;
    const originalWatermarkKey = originalKey.replace(/original/g, 'original-watermark');
    const thumbnailKey = originalKey.replace(/original/g, 'thumbnail');
    const thumbnaillWatermarkKey = originalKey.replace(/original/g, 'thumbnail-watermark');
    const albumCoverKey = originalKey.replace(/original/g, 'album-cover');

    const { Body, ContentType } = await this.bucket.getObject(originalKey);
    if (!Body || !ContentType) throw new Error('Cannot get files!');

    const originalWatermarkBuffer = await sharp(Body.toString('base64'))
      .composite([{ input: path.join(__dirname, 'assets', 'logo.png'), gravity: 'center' }])
      .sharpen()
      .withMetadata()
      .toBuffer();

    const thumbnailBuffer = await sharp(Body.toString('base64'))
      .resize(300)
      .toBuffer();

    const thumbnailWatermarkBuffer = await sharp(thumbnailBuffer)
      .composite([{ input: path.join(__dirname, 'assets', 'logo.png'), gravity: 'center' }])
      .sharpen()
      .withMetadata()
      .toBuffer();

    const albumCoverBuffer = await sharp(Body.toString('base64'))
      .resize(200, 255)
      .toBuffer();

    await this.bucket.putObject(originalWatermarkKey, originalWatermarkBuffer, ContentType);
    await this.bucket.putObject(thumbnailKey, thumbnailBuffer, ContentType);
    await this.bucket.putObject(thumbnaillWatermarkKey, thumbnailWatermarkBuffer, ContentType);
    await this.bucket.putObject(albumCoverKey, albumCoverBuffer, ContentType);
  };
}
