export class ImageInput {
  path: string;
  albumId: string;
  constructor(path: string, albumId: string) {
    this.albumId = albumId;
    this.path = path;
  }
}

export class ImageInfo {
  id: string;
  path: string;
  constructor(id: string, path: string) {
    this.id = id;
    this.path = path;
  }
}
