import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from './entities/review.entity';
import { HotelsModule } from 'src/hotels/hotels.module';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { Room } from 'src/rooms/entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Hotel, Room]),
    HotelsModule,
    ReservationsModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
