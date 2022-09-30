export class OrderInput {
  photoId: string;
  users: string[];
  constructor(photoId: string, users: string[]) {
    this.photoId = photoId;
    this.users = users;
  }
}
