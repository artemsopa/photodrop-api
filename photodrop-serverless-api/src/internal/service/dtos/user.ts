export class UserInfo {
  id: string;
  login: string;
  fullName: string | null;
  constructor(id: string, login: string, fullName: string | null) {
    this.id = id;
    this.login = login;
    this.fullName = fullName;
  }
}
