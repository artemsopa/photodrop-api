import jwt from 'jsonwebtoken';

export interface AuthManager {
    newToken(userID: string): string;
    verifyToken(token: string): string | null;
}

export interface JwtPlaceholder {
    userId: string;
}

export class JwtManager implements AuthManager {
  signingKey: string;
  TTL: string;

  constructor(signingKey: string, TTL: string) {
    if (!signingKey) {
      throw new Error('Empty access signing key!');
    }
    this.signingKey = signingKey;
    this.TTL = TTL;
  }

  newToken(userID: string): string {
    return jwt.sign({ userID }, this.signingKey, { expiresIn: this.TTL });
  }

  verifyToken(token: string) {
    try {
      const jwtObj = jwt.verify(token, this.signingKey) as JwtPlaceholder;
      return jwtObj.userId;
    } catch (error) {
      return null;
    }
  }
}
