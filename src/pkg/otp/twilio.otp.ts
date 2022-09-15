import twilio, { Twilio } from 'twilio';
import { IOTP } from './otp';
import ApiError from '../../internal/domain/error';

class TwilioOTP implements IOTP {
  private client: Twilio;
  constructor(accauntSid: string, authToken: string, private serviceId: string) {
    this.client = twilio(accauntSid, authToken);
    this.serviceId = serviceId;
  }

  async sendCode(number: string) {
    try {
      await this.client
        .verify
        .v2
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
        .v2
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

export default TwilioOTP;
