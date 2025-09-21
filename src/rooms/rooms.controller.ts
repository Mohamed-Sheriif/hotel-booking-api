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
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';
import { AllowAnonymous } from 'src/auth/decorator/allow-anonymous.decorator';

@Controller('api/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async create(
    @Body() createRoomDto: CreateRoomDto,
    @ActiveUser() user: ActiveUserType,
  ) {
    // Ignore incoming hotel_id and enforce active user's hotel
    return this.roomsService.create(
      { ...createRoomDto, hotel_id: user.hotel_id },
      user,
    );
  }

  @AllowAnonymous()
  @Get(':hotelId')
  async findAllForHotel(@Param('hotelId', ParseIntPipe) hotelId: number) {
    return this.roomsService.findAllForHotel(hotelId);
  }

  @AllowAnonymous()
  @Get(':id/reservations')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoomDto,
    @ActiveUser() user: ActiveUserType,
  ) {
    return this.roomsService.update(id, dto, user);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: ActiveUserType,
  ) {
    return this.roomsService.remove(id, user);
  }
}
