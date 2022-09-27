import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import Photo from './photo';
import Phgraph from './phgraph';
import Order from './order';

@Entity({ name: 'albums' })
export default class Album {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column()
    title: string;

  @Column()
    location: string;

  @Column({ name: 'date' })
    date: number;

  @Column({ name: 'phgraph_id' })
    phgraphId: string;
  @ManyToOne(() => Phgraph, phgraph => phgraph.albums, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'phgraph_id' })
    phgraph: Phgraph;

  @OneToMany(() => Photo, photo => photo.album)
    photos: Photo[];

  @OneToMany(() => Order, order => order.album)
    orders: Order[];

  constructor(title: string, location: string, date: number, phgraphId: string) {
    this.title = title;
    this.location = location;
    this.date = date;
    this.phgraphId = phgraphId;
  }
}
