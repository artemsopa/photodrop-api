export class AlbumInput {
  title: string;
  location: string;
  constructor(title: string, location: string) {
    this.title = title;
    this.location = location;
  }
}

export class AlbumInfo extends AlbumInput {
  id: string;
  constructor(id: string, title: string, location: string) {
    super(title, location);
    this.id = id;
  }
}
