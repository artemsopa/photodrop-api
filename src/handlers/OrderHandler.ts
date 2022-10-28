import { APIGatewayEvent } from 'aws-lambda';
import { OrderService } from '@/services/OrderService';
import { getId, okResponse, wrapped } from '@/utils/handler';
import { Jwt } from '@/utils/Jwt';
import { ordersInputSchema } from '@/validators';

export class OrderHandler {
  constructor(private readonly service: OrderService, private readonly jwt: Jwt) {
    this.service = service;
    this.jwt = jwt;
  }

  public createOrder = wrapped(
    async (event: APIGatewayEvent) => {
      const id = await getId(event, this.jwt);
      const body = await ordersInputSchema.validate(event.body);
      await this.service.createMany(id, body.albumId, body.orders);
      return okResponse(201, { message: 'Orders successfully created!' });
    },
  );
}
