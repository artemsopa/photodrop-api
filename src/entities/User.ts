import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '@/entities/Order';

@Entity({ name: 'users' })
export class User {
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

  @OneToMany(() => Order, order => order.user)
    orders: Order[];

  constructor(phone: string) {
    this.phone = phone;
  }
}
