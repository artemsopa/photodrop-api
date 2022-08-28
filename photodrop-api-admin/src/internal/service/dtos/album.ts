export class AlbumInput {
  title: string;
  icon: string;
  location: string;
  constructor(title: string, icon: string, location: string) {
    this.title = title;
    this.location = location;
    this.icon = icon;
  }
}

export class AlbumInfo extends AlbumInput {
  id: string;
  constructor(id: string, title: string, location: string, icon: string) {
    super(title, location, icon);
    this.id = id;
  }
}
