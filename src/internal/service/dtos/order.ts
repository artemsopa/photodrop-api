export class OrderInput {
  photoId: string;
  userIds: string[];
  constructor(photoId: string, userIds: string[]) {
    this.photoId = photoId;
    this.userIds = userIds;
  }
}
