export class AlbumInput {
  title: string;
  location: string;
  date: number;
  constructor(title: string, location: string, date: number) {
    this.title = title;
    this.location = location;
    this.date = date;
  }
}

export class AlbumInfo extends AlbumInput {
  id: string;
  constructor(id: string, title: string, location: string, date: number) {
    super(title, location, date);
    this.id = id;
  }
}
