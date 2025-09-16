import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { HotelStaffService } from './hotel-staff.service';

import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';
import { AllowAnonymous } from 'src/auth/decorator/allow-anonymous.decorator';

@Controller('api/hotel-staff')
export class HotelStaffController {
  constructor(private readonly hotelStaffService: HotelStaffService) {}

  @Delete(':staffId')
  async remove(
    @Param('staffId', ParseIntPipe) staffId: number,
    @ActiveUser() activeUser: ActiveUserType,
  ) {
    return this.hotelStaffService.removeStaffFromHotel(staffId, activeUser);
  }

  @AllowAnonymous()
  @Get('hotel/:hotelId')
  async list(@Param('hotelId', ParseIntPipe) hotelId: number) {
    return this.hotelStaffService.listHotelStaff(hotelId);
  }
}
