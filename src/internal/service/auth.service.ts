import { IAuthService } from './service';
import { IAuthManager } from '../../pkg/auth/auth';
import { ICameristsRepo, IUsersRepo } from '../repository/repository';
import ApiError from '../domain/error';
import { IOTP } from '../../pkg/otp/twilio';
import User from '../repository/entities/user';

class AuthService implements IAuthService {
  constructor(private cameristsRepo: ICameristsRepo, private usersRepo: IUsersRepo, private authManager: IAuthManager, private otp: IOTP) {
    this.cameristsRepo = cameristsRepo;
    this.usersRepo = usersRepo;
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

  async sendVerificationCode(phone: string) {
    await this.otp.sendCode(phone);
  }

  async verifyUser(phone: string, code: string) {
    await this.otp.verifyNumber(phone, code);
    let user = await this.usersRepo.findOneByPhone(phone);
    if (!user) user = await this.usersRepo.create(new User(phone));
    return this.authManager.newToken(user.id);
  }
}

export default AuthService;
