import AWS from 'aws-sdk';

export interface IS3 {
    listObjects(prefix: string): Promise<AWS.S3.ObjectList>;
    // createPresignedPost(prefix: string, title: string, contentType: string): Promise<AWS.S3.PresignedPost>;
    // uploadFileToS3(presignedPostData: AWS.S3.PresignedPost, title: string, buffer: Buffer): Promise<void>;
  }

class S3 implements IS3 {
  constructor(private bucket: AWS.S3, private bucketName: string) {
    this.bucket = new AWS.S3();
    this.bucketName = bucketName;
  }

  async listObjects(prefix: string) {
    const params = {
      Bucket: this.bucketName,
      Prefix: prefix,
    };
    const response = await this.bucket.listObjectsV2(params).promise();
    if (!response.Contents || response.Contents.length === 0) {
      return [];
    }
    return response.Contents;
  }

  //   createPresignedPost(prefix: string, title: string, contentType: string) {
  //     const params = {
  //       Expires: 30 * 60,
  //       Bucket: this.bucketName,
  //       Conditions: [['content-length-range', 100, 10000000]],
  //       Fields: {
  //         'Content-Type': contentType,
  //         key: `${prefix}/images/${title}`,
  //       },
  //     };
  //     return new Promise<AWS.S3.PresignedPost>((resolve, reject) => {
  //       this.bucket.createPresignedPost(params, (err, data) => {
  //         if (err) {
  //           reject(err);
  //         } else resolve(data);
  //       });
  //     });
  //   }

//   async uploadFileToS3(presignedPostData: AWS.S3.PresignedPost, title: string, buffer: Buffer) {
//     const formData = new FormData();
//     Object.keys(presignedPostData.fields).forEach((key) => {
//       formData.append(key, presignedPostData.fields[key]);
//     });
//     formData.append('file', buffer, title);
//     await this.axios.post(presignedPostData.url, formData, {
//       headers: { ...formData.getHeaders(), 'Content-Length': buffer.byteLength * 2 },
//     });
//   }
}

export default S3;
