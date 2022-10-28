import { APIGatewayEvent } from 'aws-lambda';
import { PhotoService } from '@/services/PhotoService';
import { getId, okResponse, wrapped } from '@/utils/handler';
import { Jwt } from '@/utils/Jwt';
import { idSchema, keysInputSchema, photoSignedUrlSchema } from '@/validators';

export class PhotoHandler {
  constructor(private readonly service: PhotoService, private readonly jwt: Jwt) {
    this.service = service;
    this.jwt = jwt;
  }

  public getUsersAndPhotosByAlbum = wrapped(
    async (event: APIGatewayEvent) => {
      const id = await getId(event, this.jwt);
      const query = await idSchema.validate(event.queryStringParameters);
      const data = await this.service.getUsersAndPhotosByAlbum(id, query.id);
      return okResponse(200, data);
    },
  );

  public createPhotos = wrapped(
    async (event: APIGatewayEvent) => {
      const id = await getId(event, this.jwt);
      const body = await keysInputSchema.validate(event.body);
      await this.service.createMany(id, body.albumId, body.keys);
      return okResponse(201, { message: 'Photos successfully created!' });
    },
  );

  public getPhotoUploadUrl = wrapped(
    async (event: APIGatewayEvent) => {
      const id = await getId(event, this.jwt);
      const body = await photoSignedUrlSchema.validate(event.body);
      const data = await this.service.getUploadUrl(id, body.albumId, body.contentType);
      return okResponse(200, data);
    },
  );
}
