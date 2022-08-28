import User from '../repository/entities/user';
import { UserInput } from './dtos/user';
import { IAuthService } from './service';
import { Hasher } from '../../pkg/hasher/password';
import { AuthManager } from '../../pkg/auth/jwt';
import { IUsersRepo } from '../repository/repository';
import ApiError from '../domain/error';

class AuthService implements IAuthService {
  constructor(private usersRepo: IUsersRepo, private hasher: Hasher, private authManager: AuthManager) {
    this.usersRepo = usersRepo;
    this.hasher = hasher;
    this.authManager = authManager;
  }

  async signUp(user: UserInput): Promise<void> {
    if (await this.usersRepo.isLoginExists(user.login)) {
      throw new ApiError(400, 'Login already exists!');
    }
    if (user.email) {
      if (await this.usersRepo.isEmailExists(user.email)) {
        throw new ApiError(400, 'Email already exists!');
      }
    }
    const hash = await this.hasher.hash(user.password);
    await this.usersRepo.create(new User(
      user.login,
      hash,
      user.fullName,
      user.email,
    ));
  }

  async signIn(login: string, password: string): Promise<string> {
    const user = await this.usersRepo.getByLogin(login);
    if (!user) {
      throw new ApiError(400, 'Incorrect email!');
    }
    const isPassEquals = await this.hasher.compare(password, user.password);
    if (!isPassEquals) {
      throw new ApiError(400, 'Incorrect password!');
    }
    return this.authManager.newToken(user.id);
  }
}

export default AuthService;
