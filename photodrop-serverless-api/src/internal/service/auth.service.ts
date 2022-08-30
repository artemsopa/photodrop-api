import { IAuthService } from './service';
import { IAuthManager } from '../../pkg/auth/auth';
import { ICameristsRepo } from '../repository/repository';
import ApiError from '../domain/error';

class AuthService implements IAuthService {
  constructor(private cameristsRepo: ICameristsRepo, private authManager: IAuthManager) {
    this.cameristsRepo = cameristsRepo;
    this.authManager = authManager;
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
}

export default AuthService;
