import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Photo } from '@/entities/Photo';
import { Album } from '@/entities/Album';
import { Order } from '@/entities/Order';

@Entity({ name: 'photographers' })
export class Photographer {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ unique: true })
    login: string;

  @Column()
    password: string;

  @Column({ type: String, nullable: true, name: 'full_name' })
    fullName: string | null;

  @Column({ type: String, nullable: true, unique: true })
    email: string | null;

  @OneToMany(() => Album, album => album.photographer)
    albums: Album[];

  @OneToMany(() => Photo, photo => photo.photographer)
    photos: Photo[];

  @OneToMany(() => Order, order => order.photographer)
    orders: Order[];

  constructor(login: string, password: string, fullName: string | null, email: string | null) {
    this.login = login;
    this.password = password;
    this.fullName = fullName;
    this.email = email;
  }
}
