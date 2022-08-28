import { IAuthService } from './service';
import { AuthManager } from '../../pkg/auth/jwt';
import { IUsersRepo } from '../repository/repository';
import ApiError from '../domain/error';

class AuthService implements IAuthService {
  constructor(private usersRepo: IUsersRepo, private authManager: AuthManager) {
    this.usersRepo = usersRepo;
    this.authManager = authManager;
  }

  async signIn(login: string, password: string): Promise<string> {
    const user = await this.usersRepo.getByLogin(login);
    if (!user) {
      throw new ApiError(401, 'Unauthorized! Incorrect email.');
    }
    if (password !== user.password) {
      throw new ApiError(401, 'Unauthorized! Incorrect password!');
    }
    return this.authManager.newToken(user.id);
  }
}

export default AuthService;
