import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/rooms/entities/room.entity';

export enum ReservationStatus {
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
  Pending = 'Pending',
}

@Entity('reservations')
@Index('idx_reservations_dates', ['check_in_date', 'check_out_date'])
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  @Index()
  customer_id: number;

  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @Column({ type: 'int', nullable: false })
  @Index()
  room_id: number;

  @ManyToOne(() => Room, (room) => room.reservations)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Column({ type: 'date', nullable: false })
  check_in_date: string;

  @Column({ type: 'date', nullable: false })
  check_out_date: string;

  @Column({ type: 'int', nullable: false })
  number_of_guests: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total_price: string;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.Confirmed,
  })
  status: ReservationStatus;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
