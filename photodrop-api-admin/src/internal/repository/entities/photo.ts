import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import Album from './album';
import Camerist from './camerist';
import OrderPhoto from './order_photo';

@Entity({ name: 'photo' })
export default class Photo {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column()
    path: string;

  @Column()
    albumId: string;
  @ManyToOne(() => Album, album => album.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'album_id' })
    album: Album;

  @Column()
    cameristId: string;
  @ManyToOne(() => Camerist, camerist => camerist.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'camerist_id' })
    camerist: Camerist;

  @OneToMany(() => OrderPhoto, orderPhoto => orderPhoto.photo)
    orderPhotos: OrderPhoto[];

  constructor(path: string, albumId: string, cameristId: string) {
    this.path = path;
    this.albumId = albumId;
    this.cameristId = cameristId;
  }
}
