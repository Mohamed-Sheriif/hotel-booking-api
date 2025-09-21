import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { RoomType } from 'src/room-types/entities/room-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Room, RoomType])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}

