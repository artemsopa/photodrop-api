import twilio, { Twilio } from 'twilio';
import ApiError from '../../internal/domain/error';

export interface IOTP {
  sendCode(number: string): Promise<void>;
  verifyNumber(number: string, code: string): Promise<void>;
}

export class ClientOTP implements IOTP {
  private client: Twilio;
  constructor(accaountSid: string, authToken: string, private serviceId: string) {
    this.client = twilio(accaountSid, authToken);
    this.serviceId = serviceId;
  }

  async sendCode(number: string) {
    try {
      await this.client
        .verify
        .services(this.serviceId)
        .verifications
        .create({
          to: number,
          channel: 'sms',
        });
    } catch (error) {
      console.log(error);
      throw new ApiError(400, 'Bad Request! Wrong phone number.');
    }
  }

  async verifyNumber(number: string, code: string) {
    try {
      await this.client
        .verify
        .services(this.serviceId)
        .verificationChecks
        .create({
          to: number,
          code,
        });
    } catch (error) {
      throw new ApiError(400, 'Bad Request! Wrong phone number or code.');
    }
  }
}
