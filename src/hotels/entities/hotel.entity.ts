import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OneToOne } from 'typeorm';
import { HotelStaff } from 'src/hotel-staff/entities/hotel-staff.entity';
import { Room } from 'src/rooms/entities/room.entity';

@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @Index()
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  country: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  phone_number: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  @Index()
  average_rating: string;

  @Column({ type: 'int', default: 0 })
  review_count: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToOne(() => HotelStaff, (hotelStaff) => hotelStaff.hotel)
  hotel_staff: HotelStaff;

  @OneToMany(() => Room, (room) => room.hotel)
  rooms: Room[];
}
