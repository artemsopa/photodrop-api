import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import Album from './album';
import Phgraph from './phgraph';
import User from './user';

@Entity({ name: 'photos' })
export default class Photo {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column()
    key: string;

  @Column({ name: 'is_paid' })
    isPaid: boolean;

  @Column({ name: 'album_id' })
    albumId: string;
  @ManyToOne(() => Album, album => album.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'album_id' })
    album: Album;

  @Column({ name: 'phgraph_id' })
    phgraphId: string;
  @ManyToOne(() => Phgraph, phgraph => phgraph.albums, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'phgraph_id' })
    phgraph: Phgraph;

  @Column({ name: 'user_id' })
    userId: string;
  @ManyToOne(() => User, user => user.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
    user: User;

  constructor(key: string, albumId: string, phgraphId: string, userId: string) {
    this.key = key;
    this.isPaid = false;
    this.albumId = albumId;
    this.phgraphId = phgraphId;
    this.userId = userId;
  }
}
