export class OrderInput {
  photoId: string;
  userId: string;
  constructor(photoId: string, userId: string) {
    this.photoId = photoId;
    this.userId = userId;
  }
}
