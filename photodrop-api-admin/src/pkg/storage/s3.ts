import AWS from 'aws-sdk';

export interface IS3Storage {
  getSignedUrl(key: string, cType: string): Promise<string>;
}

export class S3Storage implements IS3Storage {
  private s3: AWS.S3;
  constructor(region: string, private bucket: string) {
    this.s3 = new AWS.S3({
      region,
    });
  }

  async getSignedUrl(key: string, cType: string): Promise<string> {
    const params = {
      Key: key,
      Bucket: this.bucket,
      ContentType: cType,
      Expires: 30 * 60, // seconds number
    };
    return await this.s3.getSignedUrlPromise('putObject', params);
  }
}
