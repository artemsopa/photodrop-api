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

export class UserInfo extends UserInput {
  id: string;
  constructor(id: string, login: string, password: string, fullName: string | null, email: string | null) {
    super(login, password, fullName, email);
    this.id = id;
  }
}
