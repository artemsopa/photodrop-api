import { PhotoInfo } from './photo';

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

export class AlbumEmp extends AlbumInput {
  id: string;
  constructor(id: string, title: string, location: string, date: number) {
    super(title, location, date);
    this.id = id;
  }
}

export class AlbumInfo extends AlbumEmp {
  url: string | null;
  constructor(id: string, url: string | null, title: string, location: string, date: number) {
    super(id, title, location, date);
    this.url = url;
  }
}

export class AlbumWithPhotos extends AlbumInput {
  id: string;
  photos: PhotoInfo[];
  constructor(id: string, title: string, location: string, date: number, photos: PhotoInfo[]) {
    super(title, location, date);
    this.id = id;
    this.photos = photos;
  }
}
