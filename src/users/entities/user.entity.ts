import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OneToOne } from 'typeorm';
import { HotelStaff } from 'src/hotel-staff/entities/hotel-staff.entity';

export enum UserType {
  Customer = 'Customer',
  Admin = 'Admin',
  Staff = 'Staff',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password_hash: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 20,
  })
  first_name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 20,
  })
  last_name: string;

  @Column({
    type: 'enum',
    enum: UserType,
    nullable: false,
  })
  user_type: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  phone_number: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToOne(() => HotelStaff, (hotelStaff) => hotelStaff.user)
  hotel_staff?: HotelStaff;
}
