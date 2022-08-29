import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';
import Album from './album';

@Entity({ name: 'user' })
export default class User {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ unique: true })
    login: string;

  @Column()
    password: string;

  @Column({ type: String, nullable: true })
    fullName: string | null;

  @Column({ type: String, unique: true, nullable: true })
    email: string | null;

  @OneToMany(() => Album, album => album.user)
    albums: Album[];

  constructor(login: string, password: string, fullName: string | null, email: string | null) {
    this.login = login;
    this.password = password;
    this.fullName = fullName;
    this.email = email;
  }
}
