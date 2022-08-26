import jwt from 'jsonwebtoken'

export interface JwtManager {
    newToken(userID: string): string;
    verifyToken(token: string): string | null;
}

export interface JwtPlaceholder {
    userID: string;
}

export class AuthManager implements JwtManager {
  signingKey: string;
  TTL: string;

  constructor(signingKey: string, TTL: string) {
    if (!signingKey) {
      throw new Error('Empty access signing key!')
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
      return jwtObj.userID;
    } catch (error) {
      return null
    }
  }
}
