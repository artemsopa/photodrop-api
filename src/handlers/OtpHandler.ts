import { APIGatewayEvent } from 'aws-lambda';
import { OtpService } from '@/services/OtpService';
import { okResponse, wrapped } from '@/utils/handler';
import { phoneSchema, verifySchema } from '@/validators';

export class OtpHandler {
  constructor(private readonly service: OtpService) {
    this.service = service;
  }

  public sendVerificationCode = wrapped(
    async (event: APIGatewayEvent) => {
      const body = await phoneSchema.validate(event.body);
      await this.service.sendVerificationCode(body.phone);
      return okResponse(200, { message: `Verification code successfully sent to ${body.phone}!` });
    },
  );

  public verifyUser = wrapped(
    async (event: APIGatewayEvent) => {
      const body = await verifySchema.validate(event.body);
      const token = await this.service.verifyUser(body.phone, body.code);
      return okResponse(200, { token });
    },
  );
}
