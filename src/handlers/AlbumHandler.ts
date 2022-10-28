import { APIGatewayEvent } from 'aws-lambda';
import { AlbumService } from '@/services/AlbumService';
import { getId, okResponse, wrapped } from '@/utils/handler';
import { Jwt } from '@/utils/Jwt';
import { albumInputSchema } from '@/validators';

export class AlbumHandler {
  constructor(private readonly service: AlbumService, private readonly jwt: Jwt) {
    this.service = service;
    this.jwt = jwt;
  }

  public getAllAlbums = wrapped(
    async (event: APIGatewayEvent) => {
      const id = await getId(event, this.jwt);
      const data = await this.service.getAllByPhotographer(id);
      return okResponse(200, data);
    },
  );

  public createAlbum = wrapped(
    async (event: APIGatewayEvent) => {
      const id = await getId(event, this.jwt);
      const body = await albumInputSchema.validate(event.body);
      await this.service.create(id, body);
      return okResponse(201, { message: `Album "${body.title}" successfully created!` });
    },
  );
}
