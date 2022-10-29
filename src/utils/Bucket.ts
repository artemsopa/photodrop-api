import { S3 } from 'aws-sdk';
import { ApiError } from '@/utils/ApiError';

export class Bucket {
  private readonly s3: S3;
  constructor(private readonly bucketName: string) {
    this.s3 = new S3();
  }

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
