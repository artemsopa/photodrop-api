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

  public sendCode = async (to: string) => {
    try {
      await this.client.verify.v2
        .services(this.verifyServiceId)
        .verifications.create({
          to,
          channel: 'sms',
        });
    } catch (e) {
      throw ApiError.badRequest('Wrong phone number');
    }
  };

  public verifyNumber = async (to: string, code: string) => {
    try {
      await this.client.verify.v2
        .services(this.verifyServiceId)
        .verificationChecks.create({
          to,
          code,
        });
    } catch (e) {
      throw ApiError.badRequest('Wrong phone number or code');
    }
  };

  public sendSms = async (to: string, body: string) => {
    const res = await this.client.messages
      .create({
        body,
        messagingServiceSid: this.notifyServiceId,
        to,
      });
    return res;
  };
}
