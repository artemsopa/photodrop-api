import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { ApiError } from '@/utils/ApiError';

export class Jwt {
  constructor(private readonly signingKey: string, private readonly ttl: string) {
    this.signingKey = signingKey;
    this.ttl = ttl;
  }

  public newToken = (key: string) => sign({ key }, this.signingKey, { expiresIn: this.ttl });

  public verifyToken = (token: string) => {
    try {
      const payload = verify(token, this.signingKey) as JwtPayload;
      return payload.key;
    } catch (error) {
      throw ApiError.unauthorized('Jwt token expired');
    }
  };
}
