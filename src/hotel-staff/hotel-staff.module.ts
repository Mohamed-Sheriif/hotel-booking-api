import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelStaff } from './entities/hotel-staff.entity';
import { HotelStaffService } from './hotel-staff.service';
import { HotelStaffController } from './hotel-staff.controller';
import { User } from 'src/users/entities/user.entity';
import { Hotel } from 'src/hotels/entities/hotel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HotelStaff, User, Hotel])],
  controllers: [HotelStaffController],
  providers: [HotelStaffService],
  exports: [HotelStaffService],
})
export class HotelStaffModule {}
