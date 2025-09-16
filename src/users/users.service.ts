import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingProvider } from 'src/provider/hashing.provider';
import { UserType } from './entities/user.entity';
import { User } from './entities/user.entity';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';
import { HotelStaffService } from 'src/hotel-staff/hotel-staff.service';
import { RegisterStaffDto } from 'src/auth/dto/register-staff.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hotelStaffService: HotelStaffService,
    private readonly hashingProvider: HashingProvider,
  ) {}

  async createCustomerUser(createUserDto: CreateUserDto) {
    try {
      // check if email already exists
      const existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new BadRequestException('Email already exists!');
      }

      // hash password
      const hashedPassword = await this.hashingProvider.hashPassword(
        createUserDto.password,
      );

      // save user to database
      const newUser = this.usersRepository.create({
        ...createUserDto,
        password_hash: hashedPassword,
        user_type: UserType.Customer,
      });

      // Saving user
      const savedUser = await this.usersRepository.save(newUser);

      const { password_hash, ...result } = savedUser;

      return {
        status: 'Success',
        result,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async createStaffUser(createUserDto: RegisterStaffDto) {
    try {
      // check if email already exists
      const existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new BadRequestException('Email already exists!');
      }

      // hash password
      const hashedPassword = await this.hashingProvider.hashPassword(
        createUserDto.password,
      );

      // save user to database
      const newUser = this.usersRepository.create({
        ...createUserDto,
        password_hash: hashedPassword,
        user_type: UserType.Staff,
      });

      // Saving user
      const savedUser = await this.usersRepository.save(newUser);

      // Assign user to a hotel
      const hotelStaff = await this.hotelStaffService.assignStaffToHotel({
        userId: savedUser.id,
        hotelId: createUserDto.hotel_id,
        position: createUserDto.position,
      });

      const { password_hash, ...userResult } = savedUser;
      const { id, user, created_at, ...hotelStaffResult } = hotelStaff;

      return {
        status: 'Success',
        result: { ...userResult, ...hotelStaffResult },
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async findAll(user_type: UserType) {
    try {
      if (user_type !== UserType.Admin) {
        throw new UnauthorizedException('Unauthorized, Only admin allowed !');
      }
      const users = await this.usersRepository.find();

      return {
        status: 'Success',
        users,
      };
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw error;
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.usersRepository.findOne({ where: { email } });
    } catch (error) {
      console.error('Error retrieving user:', error);
      throw error;
    }
  }

  async findOne(id: number, activeUser: ActiveUserType) {
    try {
      // User can only retrieve his account
      if (
        id !== activeUser.sub &&
        activeUser.user_type !== UserType.Admin &&
        activeUser.user_type !== UserType.Staff
      ) {
        throw new UnauthorizedException(
          'Unauthorized, Users can only retrieve thier accounts !',
        );
      }

      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        status: 'Success',
        user,
      };
    } catch (error) {
      console.error('Error retrieving user:', error);
      throw error;
    }
  }

  async update(id: number, sub: number, updateUserDto: UpdateUserDto) {
    try {
      // User can only update his account
      if (id !== sub) {
        throw new UnauthorizedException('Unauthorized !');
      }

      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Update user object
      Object.assign(user, updateUserDto);

      // Saving user
      const savedUser = await this.usersRepository.save(user);

      const { password_hash, ...result } = savedUser;

      return {
        status: 'Success',
        result,
      };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async remove(id: number, activeUser: ActiveUserType) {
    try {
      // User can only delete his account
      if (id !== activeUser.sub && activeUser.user_type !== UserType.Admin) {
        throw new UnauthorizedException('Unauthorized !');
      }

      // Check if user exist
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Remove user
      await this.usersRepository.remove(user);

      return {
        status: 'Success',
        user,
      };
    } catch (error) {
      console.error('Error removing user:', error);
      throw error;
    }
  }
}
