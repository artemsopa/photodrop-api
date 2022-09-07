export class PhotoInput {
  key: string;
  userId: string;
  constructor(key: string, userId: string) {
    this.key = key;
    this.userId = userId;
  }
}

export class PhotoInfo {
  id: string;
  url: string;
  constructor(id: string, url: string) {
    this.id = id;
    this.url = url;
  }
}
