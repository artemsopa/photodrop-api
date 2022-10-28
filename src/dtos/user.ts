export class Profile {
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
export class UserInfo extends Profile {
  id: string;
  constructor(id: string, phone: string, fullName: string | null, email: string | null, avatar: string | null) {
    super(phone, fullName, email, avatar);
    this.id = id;
  }
}
