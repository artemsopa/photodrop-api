import jwt from 'jsonwebtoken';
import { IAuthManager, JwtPlaceholder } from './auth';

export class JwtManager implements IAuthManager {
  signingKey: string;
  TTL: string;

  constructor(signingKey: string, TTL: string) {
    if (!signingKey) {
      throw new Error('Empty access signing key!');
    }
    this.signingKey = signingKey;
    this.TTL = TTL;
  }

  newToken(cameristId: string): string {
    return jwt.sign({ cameristId }, this.signingKey, { expiresIn: this.TTL });
  }

  verifyToken(token: string) {
    try {
      const jwtObj = jwt.verify(token, this.signingKey) as JwtPlaceholder;
      return jwtObj.cameristId;
    } catch (error) {
      return null;
    }
  }
}
