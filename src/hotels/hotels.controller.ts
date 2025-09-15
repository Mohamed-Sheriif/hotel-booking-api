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
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { AllowAnonymous } from 'src/auth/decorator/allow-anonymous.decorator';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';

@Controller('api/hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  async create(
    @Body() createHotelDto: CreateHotelDto,
    @ActiveUser() activeUser: ActiveUserType,
  ) {
    return this.hotelsService.create(createHotelDto, activeUser);
  }

  @AllowAnonymous()
  @Get()
  async findAll() {
    return this.hotelsService.findAll();
  }

  @AllowAnonymous()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hotelsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHotelDto: UpdateHotelDto,
    @ActiveUser() activeUser: ActiveUserType,
  ) {
    return this.hotelsService.update(id, updateHotelDto, activeUser);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() activeUser: ActiveUserType,
  ) {
    return this.hotelsService.remove(id, activeUser);
  }
}
