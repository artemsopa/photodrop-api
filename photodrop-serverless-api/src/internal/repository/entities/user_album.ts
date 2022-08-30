import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import Album from './album';
import Camerist from './camerist';
import OrderPhoto from './order_photo';
import User from './user';

@Entity({ name: 'user_album' })
export default class UserAlbum {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ name: 'camerist_id' })
    cameristId: string;
  @ManyToOne(() => Camerist, camerist => camerist.userAlbums, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'camerist_id' })
    camerist: Camerist;

  @Column({ name: 'album_id' })
    albumId: string;
  @ManyToOne(() => Album, album => album.userAlbums, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'album_id' })
    album: Album;

  @Column({ name: 'user_id' })
    userId: string;
  @ManyToOne(() => User, user => user.userAlbums, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
    user: User;

  @OneToMany(() => OrderPhoto, orderPhoto => orderPhoto.userAlbum)
    orderPhotos: OrderPhoto[];

  constructor(cameristId: string, albumId: string, userId: string) {
    this.cameristId = cameristId;
    this.albumId = albumId;
    this.userId = userId;
  }
}
