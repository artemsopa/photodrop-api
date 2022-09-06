import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';
import Photo from './photo';

@Entity({ name: 'users' })
export default class User {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ unique: true })
    phone: string;

  @Column({ type: String, nullable: true })
    avatar: string | null;

  @Column({ type: String, nullable: true, name: 'full_name' })
    fullName: string | null;

  @Column({ type: String, nullable: true, unique: true })
    email: string | null;

  @OneToMany(() => Photo, photo => photo.user)
    photos: Photo[];

  constructor(phone: string) {
    this.phone = phone;
  }
}
