import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import Album from './album';
import Order from './order';
import Phgraph from './phgraph';

@Entity({ name: 'photos' })
export default class Photo {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column()
    key: string;

  @Column({ name: 'phgraph_id' })
    phgraphId: string;
  @ManyToOne(() => Phgraph, phgraph => phgraph.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'phgraph_id' })
    phgraph: Phgraph;

  @Column({ name: 'album_id' })
    albumId: string;
  @ManyToOne(() => Album, album => album.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'album_id' })
    album: Album;

  @OneToMany(() => Order, order => order.photo)
    orders: Order[];

  constructor(key: string, albumId: string, phgraphId: string) {
    this.key = key;
    this.albumId = albumId;
    this.phgraphId = phgraphId;
  }
}
