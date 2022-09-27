import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
} from 'typeorm';
import Phgraph from './phgraph';
import Album from './album';
import Photo from './photo';
import User from './user';

@Entity({ name: 'orders' })
export default class Order {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ name: 'is_paid' })
    isPaid: boolean;

  @Column({ name: 'album_id' })
    albumId: string;
  @ManyToOne(() => Album, album => album.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'album_id' })
    album: Album;

  @Column({ name: 'phgraph_id' })
    phgraphId: string;
  @ManyToOne(() => Phgraph, phgraph => phgraph.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'phgraph_id' })
    phgraph: Phgraph;

  @Column({ name: 'user_id' })
    userId: string;
  @ManyToOne(() => User, user => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
    user: User;

  @Column({ name: 'photo_id' })
    photoId: string;
  @ManyToOne(() => Photo, photo => photo.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'photo_id' })
    photo: Photo;

  constructor(phgraphId: string, albumId: string, photoId: string, userId: string) {
    this.isPaid = false;
    this.phgraphId = phgraphId;
    this.albumId = albumId;
    this.photoId = photoId;
    this.userId = userId;
  }
}
