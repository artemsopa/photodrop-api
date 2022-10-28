import { APIGatewayEvent } from 'aws-lambda';
import { AuthService } from '@/services/AuthService';
import { loginSchema } from '@/validators';
import { okResponse, wrapped } from '@/utils/handler';

export class AuthHandler {
  constructor(private readonly service: AuthService) {
    this.service = service;
  }

  public login = wrapped(
    async (event: APIGatewayEvent) => {
      const body = await loginSchema.validate(event.body);
      const token = await this.service.login(body.login, body.password);
      return okResponse(200, { token });
    },
  );
}
