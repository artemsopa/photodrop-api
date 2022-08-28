export class UserInput {
  login: string;
  password: string;
  fullName: string | null;
  email: string | null;
  constructor(login: string, password: string, fullName: string | null, email: string | null) {
    this.login = login;
    this.password = password;
    this.fullName = fullName;
    this.email = email;
  }
}

export class UserInfo {
  id: string;
  login: string;
  fullName: string | null;
  email: string | null;
  constructor(id: string, login: string, fullName: string | null, email: string | null) {
    this.id = id;
    this.login = login;
    this.fullName = fullName;
    this.email = email;
  }
}
