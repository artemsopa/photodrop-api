export class PhotoInput {
  path: string;
  constructor(path: string) {
    this.path = path;
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
