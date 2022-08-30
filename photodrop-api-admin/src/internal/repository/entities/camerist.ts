import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';
import Album from './album';
import OrderPhoto from './order_photo';
import Photo from './photo';
import UserAlbum from './user_album';

@Entity({ name: 'camerist' })
export default class Camerist {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ unique: true })
    login: string;

  @Column()
    password: string;

  @Column({ type: String, nullable: true, name: 'full_name' })
    fullName: string | null;

  @Column({ type: String, unique: true, nullable: true })
    email: string | null;

  @OneToMany(() => Album, album => album.camerist)
    albums: Album[];

  @OneToMany(() => Photo, photo => photo.camerist)
    photos: Photo[];

  @OneToMany(() => UserAlbum, userAlbum => userAlbum.camerist)
    userAlbums: UserAlbum[];

  @OneToMany(() => OrderPhoto, orderPhoto => orderPhoto.camerist)
    orderPhotos: OrderPhoto[];

  constructor(login: string, password: string, fullName: string | null, email: string | null) {
    this.login = login;
    this.password = password;
    this.fullName = fullName;
    this.email = email;
  }
}
