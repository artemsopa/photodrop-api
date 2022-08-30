import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
} from 'typeorm';
import Album from './album';

@Entity({ name: 'image' })
export default class Image {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column()
    path: string;

  @Column()
    albumId: string;

  @ManyToOne(() => Album, album => album.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'albumId' })
    album: Album;

  constructor(path: string, albumId: string) {
    this.path = path;
    this.albumId = albumId;
  }
}
