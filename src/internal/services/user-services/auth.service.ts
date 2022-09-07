import { IAuthUsersService } from '../services';
import { IAuthManager } from '../../../pkg/auth/auth';
import { IUsersRepo } from '../../repositories/repositories';
import { IOTP } from '../../../pkg/otp/twilio';
import User from '../../repositories/entities/user';

class AuthUsersService implements IAuthUsersService {
  constructor(private usersRepo: IUsersRepo, private authManager: IAuthManager, private otp: IOTP) {
    this.usersRepo = usersRepo;
    this.authManager = authManager;
    this.otp = otp;
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

export default AuthUsersService;
