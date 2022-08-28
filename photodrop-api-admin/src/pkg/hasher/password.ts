import bcrypt from 'bcrypt';

export interface Hasher {
    hash(password: string): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
};

export class BcryptHasher implements Hasher {
  private salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.salt);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
