import { IAuthService } from './service';
import { IAuthManager } from '../../pkg/auth/auth';
import { ICameristsRepo } from '../repository/repository';
import ApiError from '../domain/error';
import { IOTP } from '../../pkg/otp/twilio';

class AuthService implements IAuthService {
  constructor(private cameristsRepo: ICameristsRepo, private authManager: IAuthManager, private otp: IOTP) {
    this.cameristsRepo = cameristsRepo;
    this.authManager = authManager;
    this.otp = otp;
  }

  async signIn(login: string, password: string): Promise<string> {
    const camerist = await this.cameristsRepo.getByLogin(login);
    if (!camerist) {
      throw new ApiError(401, 'Unauthorized! Incorrect login.');
    }
    if (password !== camerist.password) {
      throw new ApiError(401, 'Unauthorized! Incorrect password.');
    }
    return this.authManager.newToken(camerist.id);
  }

  async getVerificationCode(phone: string) {
    await this.otp.sendCode(phone);
  }

  async verifyUser(phone: string, code: string) {
    await this.otp.verifyNumber(phone, code);
    return `Your phone ${phone} successfully confirmed!`;
  }
}

export default AuthService;
