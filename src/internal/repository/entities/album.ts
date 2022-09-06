import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import Photo from './photo';
import Camerist from './camerist';

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

  @Column({ name: 'camerist_id' })
    cameristId: string;
  @ManyToOne(() => Camerist, camerist => camerist.albums, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'camerist_id' })
    camerist: Camerist;

  @OneToMany(() => Photo, photo => photo.album)
    photos: Photo[];

  constructor(title: string, location: string, date: number, cameristId: string) {
    this.title = title;
    this.location = location;
    this.date = date;
    this.cameristId = cameristId;
  }
}
