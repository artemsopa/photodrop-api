import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, PrimaryColumn, OneToMany,
} from 'typeorm';
import Image from './image';
import User from './user';

@Entity()
export default class Album {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column()
    title: string;

  @Column()
    icon: string;

  @Column()
    location: string;

  @Column()
    userId: string;

  @ManyToOne(() => User, user => user.albums, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
    user: User;

  @OneToMany(() => Image, image => image.album)
    images: Image[];

  constructor(title: string, icon: string, location: string, userId: string) {
    this.title = title;
    this.icon = icon;
    this.location = location;
    this.userId = userId;
  }
}
