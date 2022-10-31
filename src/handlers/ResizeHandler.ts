import { S3Event } from 'aws-lambda';
import { ResizeService } from '@/services/ResizeService';

export class ResizeHandler {
  constructor(private readonly service: ResizeService) {
    this.service = service;
  }

  public resize = async (event: S3Event) => {
    event.Records.forEach(async (record) => {
      try {
        await this.service.resize(record);
      } catch (error) {
        console.log(error);
      }
    });
  };
}
