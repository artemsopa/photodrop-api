import { IAuthPhgraphsService } from '../services';
import { IAuthManager } from '../../../pkg/auth/auth';
import { IPhgraphsRepo } from '../../repositories/repositories';
import ApiError from '../../../pkg/error/api.error';

class AuthPhgraphsService implements IAuthPhgraphsService {
  constructor(private phgraphRepo: IPhgraphsRepo, private authManager: IAuthManager) {
    this.phgraphRepo = phgraphRepo;
    this.authManager = authManager;
  }

  async signIn(login: string, password: string): Promise<string> {
    const phgraph = await this.phgraphRepo.findByLogin(login);
    if (!phgraph) {
      throw new ApiError(401, 'Unauthorized! Incorrect login.');
    }
    if (password !== phgraph.password) {
      throw new ApiError(401, 'Unauthorized! Incorrect password.');
    }
    return this.authManager.newToken(phgraph.id);
  }
}

export default AuthPhgraphsService;
