import { APIGatewayEvent } from 'aws-lambda';
import { GalleryService } from '@/services/GalleryService';
import { getId, okResponse, wrapped } from '@/utils/handler';
import { Jwt } from '@/utils/Jwt';
import { idSchema } from '@/validators';

export class GalleryHandler {
  constructor(private readonly service: GalleryService, private readonly jwt: Jwt) {
    this.service = service;
    this.jwt = jwt;
  }

  public getGalleryByUser = wrapped(
    async (event: APIGatewayEvent) => {
      const id = await getId(event, this.jwt);
      const data = await this.service.getAllByUser(id);
      return okResponse(200, data);
    },
  );

  public getAllPhotosByGalleryAlbum = wrapped(
    async (event: APIGatewayEvent) => {
      const id = await getId(event, this.jwt);
      const query = await idSchema.validate(event.queryStringParameters);
      const data = await this.service.getAllPhotosByAlbum(id, query.id);
      return okResponse(200, data);
    },
  );

  public payForGalleryAlbum = wrapped(
    async (event: APIGatewayEvent) => {
      const id = await getId(event, this.jwt);
      const query = await idSchema.validate(event.queryStringParameters);
      await this.service.payForAlbum(id, query.id);
      return okResponse(200, { message: 'Album paid successfully!' });
    },
  );
}
