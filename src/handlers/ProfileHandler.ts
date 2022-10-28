import { APIGatewayEvent } from 'aws-lambda';
import { ProfileService } from '@/services/ProfileService';
import { getId, okResponse, wrapped } from '@/utils/handler';
import { Jwt } from '@/utils/Jwt';
import { avatarSignedUrlSchema, phoneSchema, updateAvatarSchema, updateEmailSchema, updateFullNameSchema, updatePhoneSchema } from '@/validators';

export class ProfileHandler {
  constructor(private readonly service: ProfileService, private readonly jwt: Jwt) {
    this.service = service;
    this.jwt = jwt;
  }

  public getProfile = wrapped(
    async (event: APIGatewayEvent) => {
      const id = await getId(event, this.jwt);
      const data = await this.service.getByUser(id);
      return okResponse(200, data);
    },
  );

  public sendProfileVerificationCode = wrapped(
    async (event: APIGatewayEvent) => {
      const id = await getId(event, this.jwt);
      const body = await phoneSchema.validate(event.body);
      await this.service.sendVerificationCode(id, body.phone);
      return okResponse(200, { message: `Verification code successfully sent to ${body.phone}!` });
    },
  );

  public updatePhone = wrapped(
    async (event: APIGatewayEvent) => {
      const id = await getId(event, this.jwt);
      const body = await updatePhoneSchema.validate(event.body);
      await this.service.updatePhone(id, body.phone, body.code);
      return okResponse(200, { message: `Phone number successfully changed to ${body.phone}!` });
    },
  );

  public updateEmail = wrapped(
    async (event: APIGatewayEvent) => {
      const id = await getId(event, this.jwt);
      const body = await updateEmailSchema.validate(event.body);
      await this.service.updateEmail(id, body.email);
      return okResponse(200, { message: `Email successfully changed to ${body.email}!` });
    },
  );

  public updateFullName = wrapped(
    async (event: APIGatewayEvent) => {
      const id = await getId(event, this.jwt);
      const body = await updateFullNameSchema.validate(event.body);
      await this.service.updateFullName(id, body.fullName);
      return okResponse(200, { message: `Full name successfully changed to ${body.fullName}!` });
    },
  );

  public getAvatarUploadUrl = wrapped(
    async (event: APIGatewayEvent) => {
      const id = await getId(event, this.jwt);
      const body = await avatarSignedUrlSchema.validate(event.body);
      const data = await this.service.getAvatarUploadUrl(id, body.contentType);
      return okResponse(200, data);
    },
  );

  public updateAvatar = wrapped(
    async (event: APIGatewayEvent) => {
      const id = await getId(event, this.jwt);
      const body = await updateAvatarSchema.validate(event.body);
      await this.service.updateAvatar(id, body.key);
      return okResponse(200, { message: 'Avatar successfully updated!' });
    },
  );
}
