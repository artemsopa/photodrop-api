import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
} from 'typeorm';
import Camerist from './camerist';
import Photo from './photo';
import User from './user';
import UserAlbum from './user_album';

@Entity({ name: 'oder_photo' })
export default class OrderPhoto {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({type: 'decimal', precision: 10, scale: 2, default: 0})
    price: number;

  @Column({ name: 'is_paid' })
    isPaid: boolean;

  @Column({ name: 'photo_id' })
    photoId: string;
  @ManyToOne(() => Photo, photo => photo.orderPhotos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'photo_id' })
    photo: Photo;

  @Column({ name: 'camerist_id' })
    cameristId: string;
  @ManyToOne(() => Camerist, camerist => camerist.orderPhotos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'camerist_id' })
    camerist: Camerist;

  @Column({ name: 'user_album_id' })
    albumId: string;
  @ManyToOne(() => UserAlbum, userAlbum => userAlbum.orderPhotos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_album_id' })
    userAlbum: UserAlbum;

  @Column({ name: 'user_id' })
    userId: string;
  @ManyToOne(() => User, user => user.orderPhotos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
    user: User;
}
