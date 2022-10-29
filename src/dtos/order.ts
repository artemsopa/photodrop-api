export class OrderInput {
  photoId: string;
  users: { userId: string, phone: string }[];
  constructor(photoId: string, users: { userId: string, phone: string }[]) {
    this.photoId = photoId;
    this.users = users;
  }
}
