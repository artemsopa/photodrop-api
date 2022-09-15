export interface IOTP {
  sendCode(number: string): Promise<void>;
  verifyNumber(id: string, token: string): Promise<void>;
}
