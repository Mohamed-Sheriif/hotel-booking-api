import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';

@Entity('reviews')
@Unique(['user_id', 'reservation_id']) // Prevent multiple reviews for the same reservation
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'hotel_id' })
  hotel_id: number;

  @Column({ name: 'reservation_id' })
  reservation_id: number;

  @Column({
    type: 'int',
    comment: 'Rating from 1 to 5 stars',
  })
  rating: number;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: 'Review title',
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Review comment',
  })
  comment: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Hotel, (hotel) => hotel.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @ManyToOne(() => Reservation, (reservation) => reservation.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;
}
