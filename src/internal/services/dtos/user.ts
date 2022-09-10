export class UserInfo {
  phone: string;
  fullName: string | null;
  email: string | null;
  avatar: string | null;
  constructor(phone: string, fullName: string | null, email: string | null, avatar: string | null) {
    this.phone = phone;
    this.fullName = fullName;
    this.email = email;
    this.avatar = avatar;
  }
}
