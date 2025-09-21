import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';

@Controller('api/reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async create(
    @Body() dto: CreateReservationDto,
    @ActiveUser() user: ActiveUserType,
  ) {
    return this.reservationsService.create(dto, user);
  }

  @Get()
  async findAll(@ActiveUser() user: ActiveUserType) {
    return this.reservationsService.findAll(user);
  }

  @Get('room/:roomId')
  async findRoomReservations(
    @Param('roomId', ParseIntPipe) roomId: number,
    @ActiveUser() user: ActiveUserType,
  ) {
    return this.reservationsService.findRoomReservations(roomId, user);
  }

  @Get('customer/:customerId')
  async getCustomerReservations(
    @Param('customerId', ParseIntPipe) customerId: number,
    @ActiveUser() user: ActiveUserType,
  ) {
    return this.reservationsService.getCustomerReservations(customerId, user);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: ActiveUserType,
  ) {
    return this.reservationsService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservationDto,
    @ActiveUser() user: ActiveUserType,
  ) {
    return this.reservationsService.update(id, dto, user);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: ActiveUserType,
  ) {
    return this.reservationsService.remove(id, user);
  }
}
