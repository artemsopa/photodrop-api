import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import Album from './album';
import Camerist from './camerist';
import Photo from './photo';
import User from './user';

@Entity({ name: 'orders' })
export default class Order {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  // @Column({type: 'decimal', precision: 10, scale: 2, default: 0})
  //   price: number;

  @Column({ name: 'is_paid' })
    isPaid: boolean;

  @Column({ name: 'camerist_id' })
    cameristId: string;
  @ManyToOne(() => Camerist, camerist => camerist.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'camerist_id' })
    camerist: Camerist;

  @Column({ name: 'album_id' })
    albumId: string;
  @ManyToOne(() => Album, album => album.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'album_id' })
    album: Album;

  @Column({ name: 'photo_id' })
    photoId: string;
  @ManyToOne(() => Photo, photo => photo.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'photo_id' })
    photo: Photo;

  @Column({ name: 'user_id' })
    userId: string;
  @ManyToOne(() => User, user => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
    user: User;

  constructor(cameristId: string, albumId: string, photoId: string, userId: string) {
    this.isPaid = false;
    this.cameristId = cameristId;
    this.albumId = albumId;
    this.photoId = photoId;
    this.userId = userId;
  }
}
