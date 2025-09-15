import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { HashingProvider } from '../provider/hashing.provider';
import { BcryptProvider } from '../provider/bcrypt.provider';
import { ConfigModule } from '@nestjs/config';
import authConfig from './config/auth.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: HashingProvider, useClass: BcryptProvider },
  ],
})
export class AuthModule {}
