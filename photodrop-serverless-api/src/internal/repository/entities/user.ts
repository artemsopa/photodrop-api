import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';
import OrderPhoto from './order_photo';
import UserAlbum from './user_album';

@Entity({ name: 'user' })
export default class User {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ unique: true })
    phone: string;

  @Column({ type: String, nullable: true })
    avatar: string | null;

  @Column({ type: String, nullable: true, name: 'full_name' })
    fullName: string | null;

  @Column({ type: String, unique: true, nullable: true })
    email: string | null;

  @OneToMany(() => UserAlbum, userAlbum => userAlbum.user)
    userAlbums: UserAlbum[];

  @OneToMany(() => OrderPhoto, orderPhoto => orderPhoto.user)
    orderPhotos: OrderPhoto[];
}
