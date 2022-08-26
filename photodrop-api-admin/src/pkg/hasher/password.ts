import bcrypt from 'bcrypt';

export default interface Hasher {
    hash(password: string): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
};

export class BcryptHasher implements Hasher {
  private salt: string;

  constructor(salt: string) {
    this.salt = salt;
  }

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.salt);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
