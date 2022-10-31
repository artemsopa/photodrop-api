import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Photographer } from '@/entities/Photographer';
import { Album } from '@/entities/Album';
import { Photo } from '@/entities/Photo';
import { User } from '@/entities/User';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ name: 'is_paid' })
    isPaid: boolean;

  @Column({ name: 'photographer_id' })
    photographerId: string;
  @ManyToOne(() => Photographer, (photographer) => photographer.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'photographer_id' })
    photographer: Photographer;

  @Column({ name: 'album_id' })
    albumId: string;
  @ManyToOne(() => Album, (album) => album.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'album_id' })
    album: Album;

  @Column({ name: 'photo_id' })
    photoId: string;
  @ManyToOne(() => Photo, (photo) => photo.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'photo_id' })
    photo: Photo;

  @Column({ name: 'user_id' })
    userId: string;
  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
    user: User;

  constructor(photographerId: string, albumId: string, photoId: string, userId: string) {
    this.isPaid = false;
    this.photographerId = photographerId;
    this.albumId = albumId;
    this.photoId = photoId;
    this.userId = userId;
  }
}
