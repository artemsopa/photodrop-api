export class PhotoItem {
  id: string;
  url: string;
  constructor(id: string, url: string) {
    this.id = id;
    this.url = url;
  }
}

export class PhotoInfo extends PhotoItem {
  isPaid: boolean;
  constructor(id: string, isPaid: boolean, url: string) {
    super(id, url);
    this.isPaid = isPaid;
  }
}
