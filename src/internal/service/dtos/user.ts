export class UserInfo {
  id: string;
  phone: string;
  fullName: string | null;
  email: string | null;
  avatar: string | null;
  constructor(id: string, phone: string, fullName: string | null, email: string | null, avatar: string | null) {
    this.id = id;
    this.phone = phone;
    this.fullName = fullName;
    this.email = email;
    this.avatar = avatar;
  }
}
