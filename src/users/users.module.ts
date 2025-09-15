import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HashingProvider } from 'src/provider/hashing.provider';
import { BcryptProvider } from 'src/provider/bcrypt.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: HashingProvider, useClass: BcryptProvider },
  ],
  exports: [UsersService],
})
export class UsersModule {}
