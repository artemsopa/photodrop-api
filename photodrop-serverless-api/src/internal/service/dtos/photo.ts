export class PhotoInput {
  path: string;
  albumId: string;
  cameristId: string;
  constructor(path: string, albumId: string, cameristId: string) {
    this.albumId = albumId;
    this.path = path;
    this.cameristId = cameristId;
  }
}

export class PhotoInfo {
  id: string;
  path: string;
  constructor(id: string, path: string) {
    this.id = id;
    this.path = path;
  }
}
