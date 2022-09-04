import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';
import Album from './album';
import Order from './order';
import Photo from './photo';

@Entity({ name: 'camerists' })
export default class Camerist {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ unique: true })
    login: string;

  @Column()
    password: string;

  @Column({ type: String, nullable: true, name: 'full_name' })
    fullName: string | null;

  @Column({ type: String, unique: true, nullable: true })
    email: string | null;

  @OneToMany(() => Album, album => album.camerist)
    albums: Album[];

  @OneToMany(() => Photo, photo => photo.camerist)
    photos: Photo[];

  @OneToMany(() => Order, order => order.camerist)
    orders: Order[];

  constructor(login: string, password: string, fullName: string | null, email: string | null) {
    this.login = login;
    this.password = password;
    this.fullName = fullName;
    this.email = email;
  }
}
