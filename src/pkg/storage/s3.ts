import AWS from 'aws-sdk';
import ApiError from '../../internal/domain/error';

export interface IS3Storage {
  getSignedUrlPut(key: string, cType: string): Promise<string>;
  getSignedUrlGet(key: string): Promise<string>;
  isImageType(contentType: string): Promise<boolean>;
}

export class S3Storage implements IS3Storage {
  private s3: AWS.S3;
  constructor(region: string, private bucket: string) {
    this.s3 = new AWS.S3({
      region,
    });
  }

  async getSignedUrlPut(key: string, cType: string): Promise<string> {
    const params = {
      Key: key,
      Bucket: this.bucket,
      ContentType: cType,
      Expires: 30 * 60, // seconds number
    };
    return await this.s3.getSignedUrlPromise('putObject', params);
  }

  async getSignedUrlGet(key: string): Promise<string> {
    const params = {
      Key: key,
      Bucket: this.bucket,
      Expires: 30 * 60,
    };
    return await this.s3.getSignedUrlPromise('getObject', params);
  }

  isImageType(contentType: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (contentType.split('/')[0] !== 'image') {
        reject(new ApiError(400, 'Invalid Content-Type!'));
      } else resolve(true);
    });
  };
}
