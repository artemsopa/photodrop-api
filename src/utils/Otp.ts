import twilio, { Twilio } from 'twilio';
import { ApiError } from '@/utils/ApiError';

export class Otp {
  private readonly client: Twilio;
  constructor(private readonly serviceId: string, accountSid: string, authToken: string) {
    this.serviceId = serviceId;
    this.client = twilio(accountSid, authToken);
  }

  public async sendCode(number: string) {
    try {
      await this.client.verify.v2
        .services(this.serviceId)
        .verifications.create({
          to: number,
          channel: 'sms',
        });
    } catch (e) {
      throw ApiError.badRequest('Wrong phone number');
    }
  }

  public async verifyNumber(number: string, code: string) {
    try {
      await this.client.verify.v2
        .services(this.serviceId)
        .verificationChecks.create({
          to: number,
          code,
        });
    } catch (e) {
      throw ApiError.badRequest('Wrong phone number or code');
    }
  }
}
