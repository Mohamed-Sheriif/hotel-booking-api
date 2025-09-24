import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { Hotel } from './entities/hotel.entity';
import { HotelStaffModule } from 'src/hotel-staff/hotel-staff.module';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel]), HotelStaffModule],
  controllers: [HotelsController],
  providers: [HotelsService],
  exports: [HotelsService],
})
export class HotelsModule {}
