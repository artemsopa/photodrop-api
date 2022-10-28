import { DataSource } from 'typeorm';
import { Jwt } from '@/utils/Jwt';
import { Otp } from '@/utils/Otp';
import { User } from '@/entities/User';

export class OtpService {
  constructor(private readonly ds: DataSource, private readonly jwt: Jwt, private readonly otp: Otp) {
    this.ds = ds;
    this.jwt = jwt;
    this.otp = otp;
  }

  public sendVerificationCode = async (phone: string) => {
    await this.otp.sendCode(phone);
  };

  public verifyUser = async (phone: string, code: string) => {
    if (!this.ds.manager.connection.isInitialized) await this.ds.initialize();

    await this.otp.verifyNumber(phone, code);
    let user = await this.ds.getRepository(User).findOne({ where: { phone } });
    if (!user) user = await this.ds.getRepository(User).save(new User(phone));
    return this.jwt.newToken(user.id);
  };
}
