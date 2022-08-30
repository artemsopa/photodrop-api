import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import Photo from './photo';
import Camerist from './camerist';
import UserAlbum from './user_album';

@Entity({ name: 'album' })
export default class Album {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column()
    title: string;

  @Column()
    location: string;

  @Column()
    cameristId: string;
  @ManyToOne(() => Camerist, camerist => camerist.albums, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'camerist_id' })
    camerist: Camerist;

  @OneToMany(() => Photo, photo => photo.album)
    photos: Photo[];

  @OneToMany(() => UserAlbum, userAlbum => userAlbum.album)
    userAlbums: UserAlbum[];

  constructor(title: string, location: string, cameristId: string) {
    this.title = title;
    this.location = location;
    this.cameristId = cameristId;
  }
}
