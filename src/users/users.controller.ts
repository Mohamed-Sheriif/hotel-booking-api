import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { UserType } from './entities/user.entity';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createCustomerUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createCustomerUser(createUserDto);
  }

  @Get()
  async findAll(@ActiveUser('user_type') user_type: UserType) {
    return this.usersService.findAll(user_type);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() activeUser: ActiveUserType,
  ) {
    return this.usersService.findOne(id, activeUser);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser('sub') sub: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, sub, updateUserDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() activeUser: ActiveUserType,
  ) {
    return this.usersService.remove(id, activeUser);
  }
}
