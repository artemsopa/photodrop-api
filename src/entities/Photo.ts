import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Photographer } from '@/entities/Photographer';
import { Album } from '@/entities/Album';
import { Order } from '@/entities/Order';

@Entity({ name: 'photos' })
export class Photo {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column()
    key: string;

  @Column({ name: 'photographer_id' })
    photographerId: string;
  @ManyToOne(() => Photographer, (photographer) => photographer.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'photographer_id' })
    photographer: Photographer;

  @Column({ name: 'album_id' })
    albumId: string;
  @ManyToOne(() => Album, (album) => album.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'album_id' })
    album: Album;

  @OneToMany(() => Order, (order) => order.photo)
    orders: Order[];

  constructor(key: string, albumId: string, photographerId: string) {
    this.key = key;
    this.albumId = albumId;
    this.photographerId = photographerId;
  }
}
