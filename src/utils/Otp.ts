import twilio, { Twilio } from 'twilio';
import { ApiError } from '@/utils/ApiError';

export class Otp {
  private readonly client: Twilio;
  constructor(
    accountSid: string,
    authToken: string,
    private readonly verifyServiceId: string,
    private readonly notifyServiceId: string,
  ) {
    this.client = twilio(accountSid, authToken);
    this.verifyServiceId = verifyServiceId;
    this.notifyServiceId = notifyServiceId;
  }

  public async sendCode(number: string) {
    try {
      await this.client.verify.v2
        .services(this.verifyServiceId)
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
        .services(this.verifyServiceId)
        .verificationChecks.create({
          to: number,
          code,
        });
    } catch (e) {
      throw ApiError.badRequest('Wrong phone number or code');
    }
  }

  public async sendSms(number: string, body: string) {
    try {
      await this.client
        .messages.create({
          to: number,
          body,
          messagingServiceSid: this.notifyServiceId,
        });
    } catch (e) {
      throw ApiError.badRequest('Cannot send sms. Check the phone number');
    }
  }
}
