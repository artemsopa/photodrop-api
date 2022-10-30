import { S3 } from 'aws-sdk';
import { ApiError } from '@/utils/ApiError';

export class Bucket {
  private readonly s3: S3;
  constructor(private readonly bucketName: string) {
    this.s3 = new S3();
  }

  public getObject = async (key: string) => await this.s3.getObject({
    Bucket: this.bucketName,
    Key: key,
  }).promise();

  public putObject = async (key: string, buffer: Buffer, contentType: string) => await this.s3.putObject({
    Bucket: this.bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }).promise();

  public getSignedUrlPutObject = async (key: string, contentType: string) => await this.s3.getSignedUrlPromise(
    'putObject',
    {
      Key: key,
      Bucket: this.bucketName,
      ContentType: contentType,
      Expires: 30 * 60,
    },
  );

  public getSignedUrlGetObject = async (key: string) => await this.s3.getSignedUrlPromise(
    'getObject',
    {
      Key: key,
      Bucket: this.bucketName,
      Expires: 30 * 60,
    },
  );

  public isImageConentType = (contentType: string) => new Promise<boolean>((resolve, reject) => {
    contentType.split('/')[0] !== 'image'
      ? reject(ApiError.badRequest('Invalid Content-Type'))
      : resolve(true);
  });
}
