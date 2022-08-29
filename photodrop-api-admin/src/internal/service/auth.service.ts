import { IAuthService } from './service';
import { IAuthManager } from '../../pkg/auth/auth';
import { IUsersRepo } from '../repository/repository';
import ApiError from '../domain/error';

class AuthService implements IAuthService {
  constructor(private usersRepo: IUsersRepo, private authManager: IAuthManager) {
    this.usersRepo = usersRepo;
    this.authManager = authManager;
  }

  async signIn(login: string, password: string): Promise<string> {
    const user = await this.usersRepo.getByLogin(login);
    if (!user) {
      throw new ApiError(401, 'Unauthorized! Incorrect login.');
    }
    if (password !== user.password) {
      throw new ApiError(401, 'Unauthorized! Incorrect password.');
    }
    return this.authManager.newToken(user.id);
  }
}

export default AuthService;
