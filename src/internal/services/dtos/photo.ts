export class PhotoInput {
  key: string;
  users: string[];
  constructor(key: string, users: string[]) {
    this.key = key;
    this.users = users;
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
