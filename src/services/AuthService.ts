import { DataSource } from 'typeorm';
import { Jwt } from '@/utils/jwt';
import { Photographer } from '@/entities/Photographer';
import { ApiError } from '@/utils/ApiError';

export class AuthService {
  constructor(private readonly ds: DataSource, private readonly jwt: Jwt) {
    this.ds = ds;
    this.jwt = jwt;
  }

  public login = async (login: string, password: string) => {
    if (!this.ds.manager.connection.isInitialized) await this.ds.initialize();

    const photographer = await this.ds.getRepository(Photographer).findOne({ where: { login } });
    if (!photographer) throw ApiError.unauthorized('Incorrect login');
    if (password !== photographer.password) throw ApiError.unauthorized('Incorrect password');
    return this.jwt.newToken(photographer.id);
  };
}
