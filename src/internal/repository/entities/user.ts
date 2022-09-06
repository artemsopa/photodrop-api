import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';
import Order from './order';

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

  @Column({ type: String, unique: true, nullable: true })
    email: string | null;

  @OneToMany(() => Order, order => order.user)
    orders: Order[];

  constructor(phone: string) {
    this.phone = phone;
  }
}
