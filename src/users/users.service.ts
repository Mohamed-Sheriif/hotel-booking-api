import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingProvider } from 'src/provider/hashing.provider';
import { UserType } from './entities/user.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly hashingProvider: HashingProvider,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
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
      throw new RequestTimeoutException('Could not create user at this time');
    }
  }

  async findAll() {
    try {
      const users = await this.usersRepository.find();

      return {
        status: 'Success',
        users,
      };
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw new RequestTimeoutException(
        'Could not retrieving users at this time',
      );
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });

      return {
        status: 'Success',
        user,
      };
    } catch (error) {
      console.error('Error retrieving user:', error);
      throw new RequestTimeoutException(
        'Could not retrieving user at this time',
      );
    }
  }

  async findOne(id: number) {
    try {
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
      throw new RequestTimeoutException(
        'Could not retrieving user at this time',
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
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
      throw new RequestTimeoutException('Could not update user at this time');
    }
  }

  async remove(id: number) {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.usersRepository.remove(user);

      return {
        status: 'Success',
        user,
      };
    } catch (error) {
      console.error('Error removing user:', error);
      throw new RequestTimeoutException('Could not remove user at this time');
    }
  }
}
