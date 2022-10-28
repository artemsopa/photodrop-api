import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Photographer } from '@/entities/Photographer';
import { Photo } from '@/entities/Photo';
import { Order } from '@/entities/Order';

@Entity({ name: 'albums' })
export class Album {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column()
    title: string;

  @Column()
    location: string;

  @Column({ name: 'date' })
    date: number;

  @Column({ name: 'photographer_id' })
    photographerId: string;
  @ManyToOne(() => Photographer, photographer => photographer.albums, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'photographer_id' })
    photographer: Photographer;

  @OneToMany(() => Photo, photo => photo.album)
    photos: Photo[];

  @OneToMany(() => Order, order => order.album)
    orders: Order[];

  constructor(title: string, location: string, date: number, photographerId: string) {
    this.title = title;
    this.location = location;
    this.date = date;
    this.photographerId = photographerId;
  }
}
